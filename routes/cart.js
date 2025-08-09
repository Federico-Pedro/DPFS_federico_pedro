var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cartController')


router.get('/cart', cartController.cart);
router.post('/add/:id', cartController.add);
router.post('/eliminate/:id', cartController.eliminate)

module.exports = router;