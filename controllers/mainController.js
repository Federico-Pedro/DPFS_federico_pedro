const products = require('../data/products.json');




let mainController = {
    index: function (req, res) {
        return res.render('index', { title: 'Ratón Blanco', style: 'styles.css' });
    },
    register: function (req, res) {
        return res.render('users/register', { title: 'Ratón Blanco', style: 'registerStyle.css' });
    },
    cart: function (req, res) {
        return res.render('products/cart', { title: 'Ratón Blanco', style: 'cartStyle.css' });
    },
    login: function (req, res) {
        return res.render('users/login', { title: 'Ratón Blanco', style: 'loginStyle.css' });
    }
}

module.exports = mainController