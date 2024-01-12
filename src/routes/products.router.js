const express = require('express');
const { ProductMongo } = require('../daos/mongo/products.daomongo');

const router = express.Router();
const products = new ProductMongo();

const handleAsync = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
        res.status(400).json({ status: 'fail', payload: error.message || 'Error desconocido' });
    });

const sendSuccess = (res, payload) => {
    res.status(200).json({ status: 'ok', payload });
};

// GET http://localhost:8080/api/products + ?limit=X
router.get('/', handleAsync(async (req, res) => {
    let { limit } = req.query;
    const getProducts = await products.getProducts();

    if (!limit || limit > getProducts.length) {
        sendSuccess(res, getProducts);
    } else {
        sendSuccess(res, getProducts.slice(0, limit));
    }
}));

// GET http://localhost:8080/api/products/:pid
router.get('/:pid', handleAsync(async (req, res) => {
    const pid = req.params.pid;
    const getProducts = await products.getProductsById(pid);

    if (typeof (getProducts) === 'string') {
        res.status(404).json({ status: 'fail', payload: getProducts });
    } else {
        sendSuccess(res, getProducts);
    }
}));

// POST http://localhost:8080/api/products/ + body: whole product
router.post('/', handleAsync(async (req, res) => {
    const newProduct = req.body;
    const resp = await products.addProduct(newProduct);

    if (typeof (resp) === 'string') {
        res.status(400).json({ status: 'fail', payload: resp });
    } else {
        sendSuccess(res, resp);
    }
}));

// PUT http://localhost:8080/api/products/:pid + body: whole product
router.put('/:pid', handleAsync(async (req, res) => {
    const pid = req.params.pid;
    const changedProduct = req.body;
    const resp = await products.updateProduct(pid, changedProduct);

    if (typeof (resp) === 'string') {
        res.status(400).json({ status: 'fail', payload: resp });
    } else {
        sendSuccess(res, resp);
    }
}));

// DELETE http://localhost:8080/api/products/:pid
router.delete('/:pid', handleAsync(async (req, res) => {
    const pid = req.params.pid;
    const resp = await products.deleteProductById(pid);

    if (typeof (resp) === 'string') {
        res.status(400).json({ status: 'fail', payload: resp });
    } else {
        sendSuccess(res, resp);
    }
}));

// DELETE http://localhost:8080/api/products?code=x
router.delete('/', handleAsync(async (req, res) => {
    const pcode = req.query.code;
    const resp = await products.deleteProductByCode(pcode);

    if (typeof (resp) === 'string') {
        res.status(400).json({ status: 'fail', payload: resp });
    } else {
        sendSuccess(res, resp);
    }
}));

module.exports = router;

