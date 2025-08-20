var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const productsController = require('../controllers/productsController');
const upload = require('../middlewares/multerMiddleware');
const notAdminMiddleware = require('../middlewares/notAdminMiddleware');

router.get('/products/:category', productsController.products);
router.get('/list', productsController.list);
router.get('/detail/:id', productsController.detail);
router.get('/create', notAdminMiddleware, productsController.create);
router.get('/edit/:id', notAdminMiddleware, productsController.edit);



router.post('/store',
    upload.single('image'),
    //Validations
    body('name')
        .notEmpty().withMessage('Ingresa el nombre del producto')
        .isLength({ min: 8 }).withMessage('El nombre debe tener al menos 8 caracteres'),

    body('description')
        .notEmpty().withMessage('Ingresa la descripción del producto')
        .isLength({ min: 50 }).withMessage('La descripción debe tener al menos 50 caracteres'),

    body('material')
        .notEmpty().withMessage('Ingresa los materiales del producto')
        .isLength({ min: 25 }).withMessage('Los materiales deben tener al menos 25 caracteres'),
    body('category').notEmpty().withMessage('Selecciona una categoría'),
    body('price').notEmpty().withMessage('Ingresa el valor del producto'),
    productsController.store);




router.post('/update/:id', notAdminMiddleware,
    upload.single('image'),
    body('name')
        .notEmpty().withMessage('Ingresa el nombre del producto')
        .isLength({ min: 8 }).withMessage('El nombre debe tener al menos 8 caracteres'),

    body('description')
        .notEmpty().withMessage('Ingresa la descripción del producto')
        .isLength({ min: 50 }).withMessage('La descripción debe tener al menos 50 caracteres'),

    body('material')
        .notEmpty().withMessage('Ingresa los materiales del producto')
        .isLength({ min: 25 }).withMessage('Los materiales deben tener al menos 25 caracteres'),
    body('category').notEmpty().withMessage('Selecciona una categoría'),
    body('price').notEmpty().withMessage('Ingresa el valor del producto'),
    productsController.update);


router.post('/delete/:id', notAdminMiddleware, productsController.delete);
router.get('/deleted', productsController.deleted);
router.get('/notFound', productsController.notFound);
router.get('/success', productsController.success)


module.exports = router;
