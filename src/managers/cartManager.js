const fs = require('node:fs').promises

class CartsManager {
    constructor(path) {
        this.path = path
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            return JSON.parse(data);
        } catch (error) {
            return []
        }
    }

    async getCartById(cid) {
        const carts = await this.readFile();
        const cart = carts.find(cart => cart.id === cid)
        return cart || 'No se encuentra el carrito'
    }

    async createCart() {
        const carts = await this.readFile();
        const newCart = {
            id: carts.length === 0 ? 1 : this.generaIdcompuesto(carts.length),
            products: []
        }
        carts.push(newCart)
        await this.writeFile(carts)
        return newCart
    }

    async addProductToCart(cid, pid) {
        const carts = await this.readFile()
        const cartIndex = carts.findIndex(cart => cart.id === cid)

        if (cartIndex === -1) {
            return 'No se encuentra el carrito'
        }

        const productIndex = carts[cartIndex].products.findIndex(product => product.productId === pid);

        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += 1;
        } else {
            carts[cartIndex].products.push({ productId: pid, quantity: 1 });
        }

        await this.writeFile(carts)
        return carts[cartIndex]
    }

    async writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8')
    }

    generaIdcompuesto(largo) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const idCorrelative = largo + 1;
        const combinedId = year * 1000000 + month * 10000 + day * 100 + idCorrelative;
        return combinedId;
    }
}

module.exports = CartsManager;
