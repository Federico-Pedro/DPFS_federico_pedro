let db = require('../database/models');

const cartPrice = async (req, res, next) => {

    res.locals.cartPrice = 0;
    res.locals.hasItems = false;

    try {
        const cart = await db.Cart.findOne({
            where: { user_id: req.session.user.id }
        });
        const cartProducts = await db.CartProduct.findAll({
            where: { cart_id: cart.cart_id },
            attributes: ['product_id']
        });
        const productIds = cartProducts.map(cp => cp.product_id);

        const products = await db.Products.findAll({
            where: {
                product_id: productIds
            }
        });

        const totalPrice = products.reduce((sum, item) => {
            return sum + item.price;
        }, 0);
        res.locals.totalPrice = totalPrice;
        res.locals.hasItems = true;



    } catch (error) {
        console.error('Error en cartMiddleware:', error);

    }

    next();
};

module.exports = cartMiddleware;
