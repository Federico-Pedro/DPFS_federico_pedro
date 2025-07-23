var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController')
const upload = require('../middlewares/multerMiddleware');


router.get('/register', userController.register);
router.get('/login', userController.login);
router.post('/storeUser', upload.single('image'), userController.storeUser);
router.get('/admin', userController.admin);
router.get('/profile', userController.profile);
router.get('/editUser/:id', userController.editUser);
router.post('/updateUser/:id', upload.single('image'), userController.updateUser);
router.post('/deleteUser/:id', userController.delete);
router.post('/loginUser', userController.loginUser);
router.get('/logout', userController.logout)

module.exports = router;
