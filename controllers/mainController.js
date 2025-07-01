let mainController = {
    index: function(req, res) {
        return res.render('index', { title: 'Ratón Blanco', style: 'styles.css'});
    },
    register: function(req, res) {
        return res.render('users/register', { title: 'Ratón Blanco', style: 'registerStyle.css'});
    },
    cart: function(req, res) {
        return res.render('products/cart', { title: 'Ratón Blanco', style: 'cartStyle.css'});
    },
    products: function(req, res) {
        return res.render('products/products', { title: 'Ratón Blanco', style: 'productStyle.css'});
    },
    detail: function(req, res) {
        return res.render('products/detail', { title: 'Ratón Blanco', style: 'detailStyle.css'});
    },
    login: function(req, res) {
        return res.render('users/login', { title: 'Ratón Blanco', style: 'loginStyle.css'});
    },
    add: function(req, res) {
        return res.render('products/addProduct', { title: 'Ratón Blanco', style: 'addStyle.css'});
    },
    edit: function(req, res) {
        return res.render('products/editProduct', { title: 'Ratón Blanco', style: 'addStyle.css'}); //a este hay que pasarle todos los valores del producto seleccionado para que el form aparezca completo cone sos datos
    }
}

module.exports = mainController