const products = require('../data/products.json');
let mainController = {
    index: function (req, res) {
        return res.render('index', { title: 'Ratón Blanco', style: 'styles.css' });
    },
    cart: function (req, res) {
        return res.render('products/cart', { title: 'Ratón Blanco', style: 'cartStyle.css' });
    }
}
module.exports = mainController