const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

let db = require('../database/models');



let productsController = {

    //Muestra todos los productos según la categoria
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

    //Lista todos los productos (función solo disponible para el admin)
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

    //Muestra el detalle del producto seleccionado
    detail: async function (req, res) {
        try {

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
        } catch (error) {
            console.log(error);
            res.redirect('/error')
        }
    },

    //Muestra el form para cargar un producto (solo admin)
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
    //Carga el producto a la base de datos y su imagen
    store: async function (req, res) {
        try {

            const data = req.body;
            let errors = validationResult(req);
            console.log('Los errores encontrados fueron: ', errors.array());
            if (!errors.isEmpty()) {

                return res.render('products/addProduct', {
                    errors: errors.mapped(),
                    black: 'Error al cargar el producto',
                    title: 'Ratón Blanco',
                    style: 'addStyle.css',
                    userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                    oldData: data
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
                
                //ACÀ NO HAY ERROR, CREA EL PRODUCTO AUNQUE NO HAYA IMAGEN PORQUE LE PONE UNA IMAGEN GENÉRICA: "raton.png"
                await db.User.create(newProduct);
            }

            return res.redirect('/success')
        } catch (error) {
            console.log(error)
        }
    },

    //Carga el formulario para editar la información de un producto
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
                    userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                    errors: {}

                });
        } else {
            return res.redirect('/notFound')
        }
    },

    //Guarda la información nueva de un producto
    update: async function (req, res) {
        try {
            
            const id = Number(req.params.id);
            let product = await db.Products.findByPk(id);
            
            let errors = validationResult(req);
            console.log('Errores:', errors)
            if (!errors.isEmpty()) {
                
                return res.render('products/editProduct',
                    {
                        black: '10% off oferta lanzamiento!!',
                        title: 'Ratón Blanco',
                        product: product,
                        style: 'addStyle.css',
                        userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png",
                        errors: errors.mapped()

                    });
            };
            
            const data = req.body;

            let filename;

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
                filename = 'raton.png';
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
            console.log(error)

        }
    },

    //Elimina un producto
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

    //Carga un vista con un mensaje de éxito en la eliminacion del producto
    deleted: function (req, res) {

        return res.render('products/deleted', {
            black: '10% off oferta lanzamiento!!',
            title: 'El producto ha sido eliminado con éxito',
            style: 'deleteStyle.css',
            userLogo: "/images/icons8-usuario-masculino-en-círculo-96.png"

        });
    },

    //Carga una vista de "producto no encontrado"
    notFound: function (req, res) {

        return res.render('products/notFound', {
            black: '10% off oferta lanzamiento!!',
            title: 'Producto no encontrado',
            style: 'deleteStyle.css',

        });
    },

    ////Carga una vista de "éxito"
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