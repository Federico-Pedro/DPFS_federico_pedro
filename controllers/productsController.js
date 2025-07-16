const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

const getProducts = () => {
  return JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
};


let productsController = {
    products: function (req, res) {
        const products = getProducts();
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
        const products = getProducts();
        const producto = products.find(p => id === p.id);

        if(producto) {

            return res.render('products/detail',
                {
                    title: 'Ratón Blanco',
                    product: producto,
                    style: 'detailStyle.css'
                    
                });
            } else {
               return res.redirect('/notFound')
            }
    },


    create: function (req, res) {
        return res.render('products/addProduct',
            {
                title: 'Ratón Blanco',
                style: 'addStyle.css'

            });
    },

    store: function (req, res) {
        const products = getProducts();

        const data = req.body;
        console.log(data);
        
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name: data.name,
            description: data.description,
            material: data.material,
            img: req.file ? req.file.filename : 'raton.png',
            category: data.category,
            price: Number(data.price)
        }

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

        return res.redirect('/success')
    },

    edit: function (req, res) {
        const id = Number(req.params.id);
        const products = getProducts();
        const producto = products.find(p => id === p.id);
        if(producto) {

            return res.render('products/editProduct',
                {
                    title: 'Ratón Blanco',
                    product: producto,
                    style: 'addStyle.css'
                    
                });
            } else {
                return res.redirect('/notFound')
            }
    },

    update: function (req, res) {
        const id = Number(req.params.id);
        const data = req.body;
        
        

            let products = getProducts();
            
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
        
        return res.redirect('/success')
    },


    delete: function (req, res) {
        const id = Number(req.params.id);
        const products = getProducts();
        
        const newProducts = products.filter(p => p.id !== id);
        const eliminated = products.filter(p => p.id === id); 
        
        console.log(eliminated)
        if (eliminated.length < 1){
            return res.redirect('/notFound')
        } else {

            
            fs.writeFileSync(productsPath, JSON.stringify(newProducts, null, 2), 'utf-8');
            
            return res.redirect('/deleted');
        }
        
        
    },

    deleted: function (req, res) {

        return res.render('products/deleted', {
            title: 'El producto ha sido eliminado con éxito',
            style: 'deleteStyle.css',

        });
    },

    notFound: function (req, res) {
        
        return res.render('products/notFound', {
            title: 'Producto no encontrado',
            style: 'deleteStyle.css',

        });
    },

    success: function (req, res) {
        
        return res.render('products/success', {
            title: 'El producto se ha cargado/actualizado con éxito',
            style: 'deleteStyle.css',

        });
    }
}



module.exports = productsController