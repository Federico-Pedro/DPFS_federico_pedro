let db = require('../database/models');

const cartMiddleware = async (req, res, next) => {

    res.locals.cartCount = 0;
    res.locals.hasItems = false;

    try {
        if (!req.session.user) {
            return next();
        }
        const cart = await db.Cart.findOne({
            where: { user_id: req.session.user.id }
        });
        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        if (!cart) {
            return next();
        }

        const cartProducts = await db.CartProduct.findAll({
            where: { cart_id: cart.cart_id },

        });

        if (cartProducts.length > 0) {

            const productsCount = cartProducts.length;
            res.locals.cartCount = productsCount;
            res.locals.hasItems = true;
        }

    } catch (error) {
        console.error('Error en cartMiddleware:', error);

    }

    next();
};

module.exports = cartMiddleware;
