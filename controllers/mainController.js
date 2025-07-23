const products = require('../data/products.json');
let mainController = {
    index: function (req, res) {
        return res.render('index', { title: 'Ratón Blanco', style: 'styles.css', black: '10% off oferta lanzamiento!!'});
    },
    cart: function (req, res) {
        return res.render('products/cart', { title: 'Ratón Blanco', style: 'cartStyle.css', black: '10% off oferta lanzamiento!!' });
    }
}
module.exports = mainController