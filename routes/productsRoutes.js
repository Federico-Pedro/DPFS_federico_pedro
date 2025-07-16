var express = require('express');
var router = express.Router();

const productsController = require('../controllers/productsController');
const upload = require('../middlewares/multerMiddleware');

router.get('/products/:category', productsController.products);
router.get('/detail/:id', productsController.detail);
router.get('/create', productsController.create);
router.get('/edit/:id', productsController.edit);
router.post('/store', upload.single('image'), productsController.store);
router.post('/update/:id', productsController.update);
router.post('/delete/:id', productsController.delete);
router.get('/deleted', productsController.deleted);
router.get('/notFound', productsController.notFound);
router.get('/success', productsController.success)


module.exports = router;
