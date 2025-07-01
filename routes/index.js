var express = require('express');
var router = express.Router();
const mainController = require('../controllers/mainController')

/* GET home page. */
router.get('/', mainController.index);
router.get('/register', mainController.register);
router.get('/cart', mainController.cart);
router.get('/products', mainController.products);
router.get('/detail', mainController.detail);
router.get('/login', mainController.login);
router.get('/addProduct', mainController.add);
router.get('/editProduct', mainController.edit)

module.exports = router;
