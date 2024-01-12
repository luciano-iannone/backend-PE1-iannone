const fs = require('fs').promises;

class ProductManager {
    constructor() {
        this.path = "./mockDB/products.json";
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const productsInJson = await fs.readFile(this.path, "utf-8");
            this.products = JSON.parse(productsInJson);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    async writeProductsToFile() {
        try {
            const productsJson = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, productsJson);
        } catch (error) {
            console.error("Error al escribir productos en el archivo", error);
        }
    }

    generateProductId() {
        return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    }

    async addProduct(productData) {
        const { title, description, price, thumbnail, code, stock, status, category } = productData;
        const id = this.generateProductId();

        if (this.products.find(product => product.code === code)) {
            console.log("Este producto ya fue agregado");
        } else {
            if (!title || !description || !price || !code || !stock) {
                console.log("Producto incorrecto: Una de estas propiedades no es válida");
            } else {
                this.products.push({ id, title, description, price, thumbnail, code, stock, status, category });
                await this.writeProductsToFile();
            }
        }
    }

    async getProducts() {
        return this.products;
    }

    async getLimitedProducts(limit) {
        if (parseInt(limit) <= 0) {
            console.log("Limite invalido");
            return [];
        } else {
            return this.products.slice(0, parseInt(limit));
        }
    }

    async getProductById(id) {
        const filteredProduct = this.products.filter(product => product.id === parseInt(id));
        if (filteredProduct.length !== 0) {
            return filteredProduct;
        } else {
            console.log("Este producto no existe");
            return [];
        }
    }

    async updateProduct(id, productData) {
        const existingProductIndex = this.products.findIndex(product => product.id === parseInt(id));

        if (existingProductIndex !== -1) {
            this.products[existingProductIndex] = { ...this.products[existingProductIndex], ...productData };
            await this.writeProductsToFile();
        } else {
            console.log("El producto a ser actualizado no fue encontrado");
        }
    }

    async deleteProduct(id) {
        const indexToDelete = this.products.findIndex(product => product.id === parseInt(id));
        if (indexToDelete !== -1) {
            this.products.splice(indexToDelete, 1);
            await this.writeProductsToFile();
        } else {
            console.log('Producto inexistente');
        }
    }
}

module.exports = ProductManager;
