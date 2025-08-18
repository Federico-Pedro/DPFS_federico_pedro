const fs = require('fs');
const path = require('path');


let db = require('../database/models');



let cartController = {

    cart: async function (req, res) {

        const user_id = req.session.user.id;
        const cart = await db.Cart.findOne({
            where: { user_id: user_id },
            include: [{
                model: db.CartProduct,
                as: 'cartProducts',
                include: [{
                    model: db.Products,
                    as: 'products'
                }]
            }]
        });

        const products = cart.cartProducts.map(cp => cp.products);



        return res.render('products/cart',
            {
                title: 'Ratón Blanco',
                style: 'cartStyle.css',
                black: '10% off oferta lanzamiento!!',
                products: products,

            });
    },
    add: async function (req, res) {
        try {

            const product_id = req.params.id;
            const user_id = req.session.user.id;
            const cart = await db.Cart.findOne({
                where: {
                    user_id: user_id
                }
            });

            if (!cart) {
                return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: 'El admin no puede agregar productos al carrito',
                    style: 'deleteStyle.css'
                });
            }

            const productExists = await db.CartProduct.findOne({
                where: {
                    cart_id: cart.cart_id,
                    product_id: product_id
                }
            });

            if (productExists) {
                
                    return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: 'El producto ya se encuentra en el carrito',
                    style: 'deleteStyle.css'
                
                });
            } else {

                const cartProduct = {
                    cart_id: cart.cart_id,
                    product_id: product_id
                }
    
                await db.CartProduct.create(cartProduct);
            }


            return res.redirect('/')
        } catch (error) {
            return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: `Se ha producido un error: ${error}`,
                    style: 'deleteStyle.css'
                
        })}
    },

    eliminate: async function (req, res) {
        try {
            const user_id = req.session.user.id;
            const cart = await db.Cart.findOne({
                where: { user_id: user_id }
            });

            await db.CartProduct.destroy({
                where: {
                    cart_id: cart.cart_id,
                    product_id: req.params.id
                }
            });

            // Redirigir al carrito (más simple)
            return res.redirect('/cart'); // o la ruta correcta de tu carrito

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send('Error interno del servidor');
        }
    }

}

module.exports = cartController;