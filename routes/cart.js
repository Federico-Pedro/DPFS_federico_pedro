var express = require('express');
var router = express.Router();
const cartController = require('../controllers/cartController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/cart', authMiddleware, cartController.cart);
router.post('/add/:id', authMiddleware, cartController.add);
router.post('/eliminate/:id', cartController.eliminate)

module.exports = router;