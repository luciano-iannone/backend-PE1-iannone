const { Router } = require('express')
const ProductManager = require('../managers/productsManager')
const productManager = new ProductManager('../data/products.json')
const router = Router()


router.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Error interno del servidor')
})

router
    .get('/', async (req, res, next) => {
        try {
            await productManager.readFromFile()
            const limit = parseInt(req.query.limit)
            const allProducts = await productManager.getProducts()

            if (!isNaN(limit)) {
                const limitedProducts = allProducts.slice(0, limit)
                res.json(limitedProducts)
            } else {
                res.json(allProducts)
            }
        } catch (error) {
            next(error)
        }
    })

    .get('/:pid', async (req, res, next) => {
        const id = parseInt(req.params.pid)
        try {
            await productManager.readFromFile()
            const product = productManager.getProductById(id)

            if (product) {
                res.json(product)
            } else {
                res.status(404).send('Producto no encontrado')
            }
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        const productId = parseInt(req.params.id)

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' })
        }

        const updatedProductData = req.body

        try {
            await productManager.updateProduct(productId, updatedProductData)
            res.json({ message: `Producto con ID ${productId} actualizado con éxito.` })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        const productId = parseInt(req.params.id)
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' })
        }

        try {
            const result = await productManager.deleteProduct(productId)
            res.json(result)
        } catch (error) {
            next(error)
        }
    })

    .post('/', async (req, res, next) => {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body

        if (!title || !description || !price || !code || !stock || !status || !category) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' })
        }

        try {
            await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category)
            res.status(201).json({ message: 'Producto agregado exitosamente.' })
        } catch (error) {
            next(error)
        }
    })

module.exports = router

