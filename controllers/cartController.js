const fs = require('fs');
const path = require('path');


let db = require('../database/models');



let cartController = {

    cart: async function (req, res) {

        const user_id = req.session.user.id;
        const cart = await db.Cart.findOne({
            where: {
                user_id: user_id
            }
        });
        const cart_id = cart.cart_id;

        const cartProducts = await db.CartProduct.findAll({
            where: {
                cart_id: cart_id
            },
            attributes: ['product_id']
        });

        const productIds = cartProducts.map(cp => cp.product_id);

        const products = await db.Products.findAll({
            where: {
                product_id: productIds
            }
        });



        return res.render('products/cart',
            {
                title: 'Ratón Blanco',
                style: 'cartStyle.css',
                black: '10% off oferta lanzamiento!!',
                products: products,
                
            });
    },
    add: async function (req, res) {
        const product_id = req.params.id;
        const user_id = req.session.user.id;
        const cart = await db.Cart.findOne({
            where: {
                user_id: user_id
            }
        });
        const cart_id = cart.cart_id;

        const cartProduct = {
            cart_id: cart_id,
            product_id: product_id
        }

        await db.CartProduct.create(cartProduct);

        return res.redirect('/')
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