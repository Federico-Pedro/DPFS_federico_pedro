var express = require('express');
var router = express.Router();

const productsController = require('../controllers/productsController')
const userController = require('../controllers/userController')
const upload = require('../middlewares/multerMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/register', guestMiddleware, userController.register);
router.get('/login', guestMiddleware, userController.login);
router.post('/storeUser', upload.single('image'), userController.storeUser);
router.get('/admin', authMiddleware, userController.admin);
router.get('/profile', authMiddleware, userController.profile);
router.get('/editUser/:id', authMiddleware, userController.editUser);
router.post('/updateUser/:id', upload.single('image'), userController.updateUser);
router.post('/deleteUser/:id', userController.delete);
router.post('/loginUser', userController.loginUser);
router.get('/logout', userController.logout);
router.get('/list', productsController.list);

module.exports = router;
