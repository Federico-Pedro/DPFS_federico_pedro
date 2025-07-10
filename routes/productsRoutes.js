var express = require('express');
var router = express.Router();

const productsController = require('../controllers/productsController')

router.get('/products/:category', productsController.products);
router.get('/detail/:id', productsController.detail);
router.get('/create', productsController.create);
router.get('/edit/:id', productsController.edit);
router.post('/store', productsController.store);
router.post('/update/:id', productsController.update);
router.get('/delete/:id', productsController.delete);
router.get('/deleted', productsController.deleted)


module.exports = router;
