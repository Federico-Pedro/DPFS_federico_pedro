var express = require('express');
var router = express.Router();
const mainController = require('../controllers/mainController')
const productsController = require('../controllers/productsController')

/* GET home page. */
router.get('/', mainController.index);
router.get('/register', mainController.register);
router.get('/cart', mainController.cart);
router.get('/login', mainController.login);



module.exports = router;
