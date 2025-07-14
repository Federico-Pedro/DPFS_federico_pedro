const fs = require('fs');
const path = require('path');

const products = require('../data/products.json');

const productsPath = path.join(__dirname, '../data/products.json');



let productsController = {
    products: function (req, res) {
        const categoria = req.params.category;
        const productosFiltrados = products.filter(p => p.category === categoria);

        return res.render('products/products',
            {
                title: categoria,
                products: productosFiltrados,
                style: 'productStyle.css'

            });
    },

    detail: function (req, res) {
        const id = Number(req.params.id);
        const producto = products.find(p => id === p.id);
        return res.render('products/detail',
            {
                title: 'Ratón Blanco',
                product: producto,
                style: 'detailStyle.css'

            });
    },


    create: function (req, res) {
        return res.render('products/addProduct',
            {
                title: 'Ratón Blanco',
                style: 'addStyle.css'

            });
    },

    store: function (req, res) {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        const data = req.body;
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name: data.name,
            description: data.description,
            material: data.material,
            img: data.img || '/images/db_images/raton.png',
            category: data.category,
            price: Number(data.price)
        }

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

        return res.redirect('/')
    },

    edit: function (req, res) {
        const id = Number(req.params.id);
        const producto = products.find(p => id === p.id);
        return res.render('products/editProduct',
            {
                title: 'Ratón Blanco',
                product: producto,
                style: 'addStyle.css'

            });
    },

    update: function (req, res) {
        const id = Number(req.params.id);
        const data = req.body;
        console.log("el id de este producto es " + id);
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        const productIndex = products.findIndex(p => p.id === id);


        products[productIndex] = {
            ...products[productIndex],
            name: data.name,
            description: data.description,
            material: data.material,
            img: req.file ? data.filename : products[productIndex].img,
            category: data.category,
            price: Number(data.price)
        };


        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

        return res.redirect('/')
    },


    delete: function (req, res) {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const producto = products.find(p => id === p.id);
        const categoria = producto.category;
        const newProducts = products.filter(p => p.id !== id);

        fs.writeFileSync(productsPath, JSON.stringify(newProducts, null, 2), 'utf-8');


        return res.redirect('/deleted');
    },

    deleted: function (req, res) {
               
    return res.render('products/deleted', {
        title: 'El producto ha sido eliminado con éxito',
        style: 'deleteStyle.css',
    
    });
}
    }



module.exports = productsController