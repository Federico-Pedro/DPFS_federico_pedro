var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../database/models');
const productsController = require('../controllers/productsController')
const userController = require('../controllers/userController')
const upload = require('../middlewares/multerMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/register', guestMiddleware, userController.register);
router.get('/login', guestMiddleware, userController.login);

router.post('/storeUser',

    upload.single('image'),
    //Validations
    body('email').isEmail().withMessage('El formato del email es incorrecto'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    body('name').notEmpty().isLength({ min: 2 }).withMessage('El nombre es obligarorio'),
    body('lastName').notEmpty().isLength({ min: 2 }).withMessage('El apellido es obligarorio'),
    body('image')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('La imagen es obligatoria');
            }
            if (req.file && !req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                throw new Error('Solo se permiten imágenes JPG, PNG o GIF');
            }
            return true;
        }),
    userController.storeUser);

router.get('/admin', authMiddleware, userController.admin);
router.get('/profile', authMiddleware, userController.profile);
router.get('/editUser/:id', authMiddleware, userController.editUser);

router.post('/updateUser/:id',
    upload.single('image'),
    body('email').isEmail().withMessage('El formato del email es incorrecto'),
    // body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    // body('repeatPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    body('name').notEmpty().withMessage('El nombre es obligarorio'),
                //.isLength({ min: 2 }).withMessage('Minimo 2 caracteres'),
    body('lastName').notEmpty().withMessage('El apellido es obligarorio'),
                    //.isLength({ min: 2 }).withMessage('Minimo 2 caracteres'),
    body('image')
        .custom((value, { req }) => {
            if (req.file && !req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                throw new Error('Solo se permiten imágenes JPG, PNG o GIF');
            }
            return true;
        }),
    userController.updateUser);


router.post('/deleteUser/:id', userController.delete);




router.post('/loginUser',
    //Validations
    body('email')
        .notEmpty().withMessage('Debes completar el mail para ingresar')
        .isEmail().withMessage('El formato del mail es incorrecto')
        .custom(async (value) => {
            const user = await db.User.findOne({ where: { email: value } });
            if (!user) throw new Error('No existe un usuario registrado con este mail');
            return true;
        }),
    body('password')
        .notEmpty().withMessage('Debes ingresar tu contraseña'),

    userController.loginUser);


router.get('/logout', userController.logout);
router.get('/list', productsController.list);

module.exports = router;
