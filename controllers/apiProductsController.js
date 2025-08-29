const db = require('../database/models');

const apiProductsController = {
    getAll: async (req, res) => {

        const products = await db.Products.findAll();
        const cleanProducts = products.map(product => ({
            id: product.product_id,
            name: product.name,
            description: product.description,
            material: product.material,
            category: product.category,
            price: product.price,
            image: `http://localhost:3000/images/products/${product.img}`,
            detail: `http://localhost:3000/api/products/${product.product_id}`
        }))
        const muñecas = await db.Products.findAll({
            where: {
                category: 'muñecas'
            }
        });
        const ovejas = await db.Products.findAll({
            where: {
                category: 'ovejas'
            }
        });
        const animales = await db.Products.findAll({
            where: {
                category: 'animales'
            }
        });
        const quantity = products.length;
        res.json({
            data: cleanProducts,
            quantity,
            muñecas: muñecas.length,
            ovejas: ovejas.length,
            animales: animales.length
        });
    },

    getById: async (req, res) => {
        const product = await db.Products.findByPk(req.params.id);
        const cleanProduct = {
            ...product.toJSON(),
            img: `http://localhost:3000/images/products/${product.img}`,
        }
        res.json(cleanProduct)
    }
}

module.exports = apiProductsController;