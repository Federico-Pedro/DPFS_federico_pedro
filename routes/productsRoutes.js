var express = require('express');
var router = express.Router();

const productsController = require('../controllers/productsController');
const upload = require('../middlewares/multerMiddleware');
const notAdminMiddleware = require('../middlewares/notAdminMiddleware');

router.get('/products/:category', productsController.products);
router.get('/list', productsController.list);
router.get('/detail/:id', productsController.detail);
router.get('/create', notAdminMiddleware, productsController.create);
router.get('/edit/:id', notAdminMiddleware, productsController.edit);
router.post('/store', upload.single('image'), productsController.store);
router.post('/update/:id', notAdminMiddleware, upload.single('image'), productsController.update);
router.post('/delete/:id', notAdminMiddleware, productsController.delete);
router.get('/deleted', productsController.deleted);
router.get('/notFound', productsController.notFound);
router.get('/success', productsController.success)


module.exports = router;
