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
        const user = req.session.user
        console.log(user)
        return res.render('products/products',
            {
                user: user,
                black: '10% off oferta lanzamiento!!',
                title: categoria,
                products: productosFiltrados,
                style: 'productStyle.css',
                userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"

            });
    },

    detail: function (req, res) {
        const id = Number(req.params.id);
        const products = getProducts();
        const producto = products.find(p => id === p.id);

        if(producto) {

            return res.render('products/detail',
                {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Ratón Blanco',
                    product: producto,
                    style: 'detailStyle.css',
                    userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"
                    
                });
            } else {
               return res.redirect('/notFound')
            }
    },


    create: function (req, res) {
        return res.render('products/addProduct',
            {
                black: '10% off oferta lanzamiento!!',
                title: 'Ratón Blanco',
                style: 'addStyle.css',
                userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"

            });
    },

    store: function (req, res) {
        const products = getProducts();

        const data = req.body;
        console.log(data);
        
        const newProduct = {
            black: '10% off oferta lanzamiento!!',
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
                    black: '10% off oferta lanzamiento!!',
                    title: 'Ratón Blanco',
                    product: producto,
                    style: 'addStyle.css',
                    userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"
                    
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
                img: req.file ? req.filename : products[productIndex].img,
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
            black: '10% off oferta lanzamiento!!',
            title: 'El producto ha sido eliminado con éxito',
            style: 'deleteStyle.css',
            userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"

        });
    },

    notFound: function (req, res) {
        
        return res.render('products/notFound', {
            black: '10% off oferta lanzamiento!!',
            title: 'Producto no encontrado',
            style: 'deleteStyle.css',

        });
    },

    success: function (req, res) {
        
        return res.render('products/success', {
            black: '10% off oferta lanzamiento!!',
            title: 'El producto se ha cargado/actualizado con éxito',
            style: 'deleteStyle.css',
            userLogo:"/images/icons8-usuario-masculino-en-círculo-96.png"

        });
    }
}



module.exports = productsController