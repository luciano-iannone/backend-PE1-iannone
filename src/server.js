const express = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const productRouter = require('./routes/products.router.js')

const cartRouter = require('./routes/carts.router.js')


app.use('/api/products', productRouter);

app.use('/api/carts', cartRouter);


app.listen(8080, () => {
    console.log('Escuchando puerto 8080');
});

const serverIO = new Server(serverHttp);

const products = new PManager('./data/products.json');
serverIO.on('connection', io => {
    console.log("Cliente nuevo conectado.");
    io.on('nuevoProducto', async newProduct => {
        await products.addProduct(newProduct);
        const listProduct = await products.getProducts()
        io.emit('productos', listProduct)
    })

    io.on('eliminarProducto', async code => {
        await products.deleteProductByCode(code);
        const listProduct = await products.getProducts()
        io.emit('productos', listProduct)
    })
})