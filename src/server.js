const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const { connectDb } = require('./config/config.js');
const ProductManager = require('./daos/fileSystem/productManager.js');
const { messageModel } = require('../src/daos/mongo/models/message.model.js');
const { productModel } = require('../src/daos/mongo/models/product.model.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Configure session
const sessionStore = mongoStore.create({
    mongoUrl: 'mongodb+srv://nicolasseia0:arCZpn6vklZ6nebR@cluster0.bmytq5v.mongodb.net/ecommerce?retryWrites=true&w=majority',
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ttl: 15000000000,
});

app.use(session({
    store: sessionStore,
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Configure handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b,
    },
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Configure routers
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const sessionRouter = require('./routes/session.router.js');

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use('/api/session', sessionRouter);

// Configure server and database connection
const serverHttp = app.listen(8080, () => {
    console.log(`Example app listening on port 8080`);
});
connectDb();

// Configure WebSocket server
const io = new Server(serverHttp);
io.on('connection', socket => {
    console.log('New client connection');

    const updateProductsList = async () => {
        const productsList = await productModel.find();
        socket.emit('products', productsList);
    };

    socket.on('newProduct', async addProduct => {
        const newProduct = new productModel(addProduct);
        await newProduct.save();
        await updateProductsList();
    });

    socket.on('deleteProduct', async deleteProductById => {
        await productModel.findByIdAndDelete(deleteProductById);
        await updateProductsList();
    });

    socket.on('message', async (data) => {
        console.log(`${data.user}: ${data.message}`);

        try {
            const newMessage = {
                message: data.message,
                timestamp: new Date(),
            };

            let userDocument = await messageModel.findOne({ user: data.user });

            if (!userDocument) {
                userDocument = new messageModel({
                    user: data.user,
                    messages: [newMessage],
                });
            } else {
                userDocument.messages.push(newMessage);
            }

            await userDocument.save();

            io.emit('messageLogs', { user: data.user, message: newMessage });
        } catch (error) {
            console.error('Error saving message to database:', error);
        }
    });
});

module.exports = app;
