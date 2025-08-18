const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

let db = require('../database/models');



let productsController = {
    products: async function (req, res) {
        const products = await db.Products.findAll({
            where: {
                category: req.params.category
            }
        });

        const user = req.session.user

        return res.render('products/products',
            {
                user: user,
                black: '10% off oferta lanzamiento!!',
                title: req.params.category,
                products: products,
                style: 'productStyle.css',
                userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

            });
    },

    list: async function (req, res) {
        const products = await db.Products.findAll();

        const user = req.session.user

        return res.render('products/products',
            {
                user: user,
                black: '10% off oferta lanzamiento!!',
                title: 'Todos los productos',
                products: products,
                style: 'productStyle.css',
                userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

            });
    },

    detail: async function (req, res) {
        const user = req.session.user;
        const id = req.params.id;
        const product = await db.Products.findByPk(id);

        if (product) {

            return res.render('products/detail',
                {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Ratón Blanco',
                    product: product,
                    style: 'detailStyle.css',
                    userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                    user: user

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
                userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                errors: {},
                oldData: {}

            });
    },

    store: async function (req, res) {
        try {
            
            const data = req.body;
            let errors = validationResult(req);
            console.log('Los errores encontrados fueron: ', errors.array());
            if(!errors.isEmpty()){

                return res.render('products/addProduct', {
                errors: errors.mapped(),
                black: 'Error al cargar el producto',
                title: 'Ratón Blanco',
                style: 'addStyle.css',
                userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                oldData : data
            })
        }
            let filename;
            if (req.file) {
                filename = 'img-' + Date.now() + path.extname(req.file.originalname);
            }
            
            const newProduct = {
                name: data.name,
                description: data.description,
                material: data.material,
                img: req.file ? filename : 'raton.png',
                category: data.category,
                price: Number(data.price)
            }
            if (req.file) {

                const imagePath = path.join(__dirname, '../public/images/products', filename);
                await db.Products.create(newProduct);
                fs.writeFileSync(imagePath, req.file.buffer);
            } else {

                await db.User.create(newProduct);
            }
            
            return res.redirect('/success')
        } catch (error) {
            console.log(error)
        }
    },


    edit: async function (req, res) {
        const id = Number(req.params.id);
        const product = await db.Products.findByPk(id);
        if (product) {

            return res.render('products/editProduct',
                {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Ratón Blanco',
                    product: product,
                    style: 'addStyle.css',
                    userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

                });
        } else {
            return res.redirect('/notFound')
        }
    },

    update: async function (req, res) {
        try {

            const id = Number(req.params.id);
            const data = req.body;
            console.log(data);
            let product = await db.Products.findByPk(id);
            console.log(product);
            let filename;
            console.log("EL ARCHIVO NUEVO ES: " + req.file);
            if (req.file) {
                const imagePath = path.join(__dirname, '../public/images/products', product.img);
                filename = 'img-' + Date.now() + path.extname(req.file.originalname);
                console.log('Nombre del archivo ' + filename)

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${product.img}`);
                    const newImagePath = path.join(__dirname, '../public/images/products', filename);
                    fs.writeFileSync(newImagePath, req.file.buffer);
                } else {
                    console.log('La imagen no existe en la ruta especificada');
                }
            } else {
                filename = 'user.png';
                console.log('El producto no tiene imagen o es undefined');

            };

            product = {
                ...product.dataValues,
                name: data.name,
                description: data.description,
                material: data.material,
                img: req.file ? filename : product.img,
                category: data.category,
                price: Number(data.price)
            }
            await db.Products.update(product, {
                where: {
                    product_id: id
                }
            });
            return res.redirect('/success')
        } catch (error) {
            console.log('Error: ' + error)
            return res.redirect('/notFound')
        }
    },


    delete: async function (req, res) {
        const id = Number(req.params.id);
        const product = await db.Products.findByPk(id);

        if (!product) {
            return res.redirect('/notFound')
        } else {
            if (product.img && product.img !== 'raton.png') {
                const imagePath = path.join(__dirname, '../public/images/products', product.img);


                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${product.img}`);
                } else {
                    console.log('La imagen no existe en la ruta especificada');
                }
            } else {
                console.log('El producto no tiene imagen o product.img es undefined');
            }

            await db.CartProduct.destroy({
                where: {
                    product_id: product.product_id
                }
            })

            await db.Products.destroy({
                where: {
                    product_id: id
                }
            });


            return res.redirect('/deleted');
        }

    },

    deleted: function (req, res) {

        return res.render('products/deleted', {
            black: '10% off oferta lanzamiento!!',
            title: 'El producto ha sido eliminado con éxito',
            style: 'deleteStyle.css',
            userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

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
            userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

        });
    }
}



module.exports = productsController