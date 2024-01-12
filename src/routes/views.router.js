const { Router } = require('express');
const productViewService = require('../daos/mongo/productDaoMongo');
const { userModel } = require('../daos/mongo/models/user.model');

const router = Router();

const renderPage = async (req, res, view, title) => {
    try {
        const { limit, pageNumber, sort, query } = req.query;
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        const userId = req.session?.user?.user || null;
        const user = await userModel.findOne({ _id: userId }).lean();
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } = await productViewService.getProducts({ limit: parsedLimit, pageNumber, sort, query });

        res.render(view, {
            title,
            user,
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

router.get('/', async (req, res) => {
    await renderPage(req, res, 'home', 'Home');
});

router.get('/realTimeProducts', async (req, res) => {
    await renderPage(req, res, 'realTimeProducts', 'Real Time');
});


router.get('/products', async (req, res) => {
    await renderPage(req, res, 'productsView', 'Products View');
});

router.get('/products/details/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const filteredProduct = await productViewService.getProductById(pid);

        if (filteredProduct) {
            res.render('details', {
                title: 'Product Detail',
                filteredProduct
            });
        } else {
            res.status(404).send("Product not exist");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;

