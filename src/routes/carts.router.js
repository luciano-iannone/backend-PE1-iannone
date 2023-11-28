const { Router } = require('express');
const CartsManager = require('../managers/cartManager');
const cartsService = new CartsManager('./src/data/carts.json');
const router = Router();


router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({
        status: 'error',
        message: 'Error interno del servidor'
    })
});

router
    .get('/', async (req, res) => {
        try {
            await cartsService.readFile();
            const allCarts = await cartsService.getCars();
            res.send({
                status: 'success',
                payload: allCarts
            });
        } catch (error) {
            next(error);
        }
    })

    .post('/', async (req, res) => {
        try {
            const result = await cartsService.createCart();
            res.status(201).send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            next(error);
        }
    })

    .get('/:cid', async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartsService.getCartById(parseInt(cid));
            if (typeof cart === 'string') {
                res.status(404).send({
                    status: 'error',
                    message: cart
                });
            } else {
                res.send({
                    status: 'success',
                    payload: cart
                });
            }
        } catch (error) {
            next(error);
        }
    })

    .post('/:cid/product/:pid', async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const result = await cartsService.addProductToCart(parseInt(cid), parseInt(pid));
            if (typeof result === 'string') {
                res.status(404).send({
                    status: 'error',
                    message: result
                });
            } else {
                res.send({
                    status: 'success',
                    payload: result
                });
            }
        } catch (error) {
            next(error);
        }
    });

module.exports = router;