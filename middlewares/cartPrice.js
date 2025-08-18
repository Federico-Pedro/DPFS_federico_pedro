let db = require('../database/models');

const cartPrice = async (req, res, next) => {

    res.locals.cartPrice = 0;
    res.locals.hasItems = false;
    

    try {
        if (!req.session.user){
            return next();
        }
        const cart = await db.Cart.findOne({
            where: { user_id: req.session.user.id }
        });

        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        
        if (!cart){
            return next();
        }
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
            return sum + Number(item.price);
        }, 0);

        res.locals.totalPrice = totalPrice;
        res.locals.hasItems = true;
  

    } catch (error) {
        console.error('Error en cartPrice:', error);

    }

    next();
};

module.exports = cartPrice;
