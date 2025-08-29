var express = require('express');
var router = express.Router();
const apiUsers = require('../controllers/apiUsersController');
const apiProducts = require('../controllers/apiProductsController');


router.get('/users', apiUsers.getAll);
router.get('/users/:id', apiUsers.getById);
router.get('/products', apiProducts.getAll);
router.get('/products/:id', apiProducts.getById);









module.exports = router;