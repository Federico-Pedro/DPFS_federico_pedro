var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
/* GET users listing. */
router.get('/register', userController.register);
router.get('/login', userController.login);
router.post('/storeUser', userController.storeUser);

module.exports = router;
