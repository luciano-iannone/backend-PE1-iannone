const express = require('express');
const { CartMongo } = require('../daos/mongo/cart.daomongo');

const router = express.Router();
const carrito = new CartMongo();

const handleAsync = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
        res.status(400).json({ status: 'fail', data: error.message || 'Error desconocido' });
    });

const sendSuccess = (res, data) => {
    res.status(200).json({ status: 'ok', data });
};

// GET http://localhost:8080/api/carts/:cid
router.get('/:cid', handleAsync(async (req, res) => {
    const id = req.params.cid;
    const resp = await carrito.getCarts(id);
    sendSuccess(res, resp);
}));

// POST http://localhost:8080/api/carts/
router.post('/', handleAsync(async (req, res) => {
    const result = await carrito.create();
    sendSuccess(res, result);
}));

// POST http://localhost:8080/api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', handleAsync(async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await carrito.addProduct(cid, pid);
    sendSuccess(res, resp);
}));

// DELETE http://localhost:8080/api/carts/:cid/product/:pid
router.delete('/:cid/product/:pid', handleAsync(async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await carrito.removeProduct(cid, pid);
    sendSuccess(res, resp);
}));

module.exports = router;
