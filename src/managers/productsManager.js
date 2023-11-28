const fs = require('node:fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.readFromFile();
    }

    async readFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error(`Archivo no encontrado ${this.path}`);
            this.products = [];
        }
    }

    async writeToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error al escribir en el archivo ${this.path}`);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !code || !stock || !status || !category) {
            console.error("Todos los campos son requeridos.");
            return;
        }

        if (this.getProductByCode(code)) {
            console.error("El código del producto ya existe.");
            return;
        }

        const product = {
            id: this.generaIdcompuesto(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };

        this.products.push(product);
        this.writeToFile();
        console.log("Producto agregado con éxito.");
    }

    deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index !== -1) {
            this.products.splice(index, 1);
            this.writeToFile();
            console.log(`Producto con ID ${id} eliminado con éxito.`);
            return { success: true, message: `Producto con ID ${id} eliminado con éxito.` };
        } else {
            console.error(`No se encontró un producto con ID ${id}.`);
            return { success: false, message: `No se encontró un producto con ID ${id}.` };
        }
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id);

        if (index !== -1) {
            const requiredFields = ['title', 'description', 'price', 'code', 'stock'];

            if (requiredFields.every((field) => updatedProduct[field] !== undefined)) {
                this.products[index] = {
                    id,
                    ...updatedProduct,
                };

                this.writeToFile();
                console.log(`Producto con ID ${id} actualizado con éxito.`);
            } else {
                console.error("Todos los campos son requeridos para la actualización.");
            }
        } else {
            console.error(`No se encontró un producto con ID ${id}.`);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find((product) => product.id === id);
    }

    getProductByCode(code) {
        return this.products.some((product) => product.code === code);
    }

    generaIdcompuesto() {
        const now = new Date();
        const [year, month, day] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
        const idCorrelative = this.products.length + 1;
        const combinedId = year * 1000000 + month * 10000 + day * 100 + idCorrelative;
        return combinedId;
    }
}

module.exports = ProductManager;

