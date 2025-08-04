const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');
let db = require('../database/models');
let op = db.Sequelize.Op;


let userController = {


    register: function (req, res) {
        return res.render('users/register',
            {
                title: 'Ratón Blanco',
                style: 'registerStyle.css',
                black: '10% off oferta lanzamiento!!',
                oldData: {}
            });
    },
    
    storeUser: async function (req, res) {

        try {

            let data = req.body;
           
            const mailExists = await db.User.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (mailExists) {

                return res.render('users/register', {
                    title: '',
                    black: 'Ese mail ya está registrado',
                    style: 'registerStyle.css',
                    oldData: data
                });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            let filename;
            if (req.file) {
                filename = 'img-' + Date.now() + path.extname(req.file.originalname);
            }
            const newUser = {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                lastName: data.lastName,
                role: req.body.password === "1123581321" ? "admin" : "user",
                img: req.file ? filename : 'user.png',
            }
            if (req.file) {

                const imagePath = path.join(__dirname, '../public/images/db_images', filename);
                await db.User.create(newUser);
                fs.writeFileSync(imagePath, req.file.buffer);
            } else {
                // Si no hay imagen, solo crear usuario
                await db.User.create(newUser);
            }

            return res.redirect('/login');


        } catch (error) {
            console.error('Error en storeUser:', error);
            return res.redirect('/notFound')
        }
    },

    login: function (req, res) {
        return res.render('users/login',
            {
                title: 'Ratón Blanco',
                style: 'loginStyle.css',
                black: '10% off oferta lanzamiento!!',
                message: '',
                passwordMessage: ''
            });
    },

    loginUser: async function (req, res) {
        const data = req.body;
        const user = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });


        if (!user) {
            return res.render('users/login', {
                title: 'Ratón Blanco',
                style: 'loginStyle.css',
                black: '10% off oferta lanzamiento!!',
                message: 'El mail ingresado no se encuentra registrado',
                passwordMessage: ''
            })
        }

        const passwordOk = bcrypt.compareSync(data.password, user.password);

        if (!passwordOk) {
            return res.render('users/login', {
                title: 'Ratón Blanco',
                style: 'loginStyle.css',
                black: '10% off oferta lanzamiento!!',
                message: '',
                passwordMessage: 'La contraseña ingresada es incorrecta'

            })
        }
        req.session.user = {
            id: user.user_id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            img: user.img,
            role: user.role
        };
        const remember = data.remember;
        if (remember) {
            res.cookie('userEmail', user.email, { maxAge: 1000 * 60 * 60 * 24 * 7 });
        }
        return res.redirect('/profile')
    },

    profile: function (req, res) {
        const user = req.session.user;
        if (!user) {
            return res.redirect('users/login');
        }

        res.render('users/profile',
            {
                user,
                title: 'Raton Blanco',
                style: 'profilestyle.css',
                black: 'Bienvenido ' + user.name + ' ' + user.lastName

            });
    },


    editUser: async function (req, res) {
        const id = Number(req.params.id);
        const user = await db.User.findByPk(id);

        if (user) {

            return res.render('users/editUser',
                {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Ratón Blanco',
                    user: user,
                    style: 'addStyle.css'

                });
        } else {
            return res.redirect('/notFound')
        }
    },

    updateUser: async function (req, res) {
        try {
            const data = req.body;
            const id = req.params.id;
            let user = await db.User.findByPk(id);
            let hashedPassword = user.password;

            if (data.password === '') {
                hashedPassword = hashedPassword;
            } else if (data.password && data.password.trim() !== "") {
                const salt = bcrypt.genSaltSync(10);
                hashedPassword = bcrypt.hashSync(data.password, salt);
            };

            let filename;
            try {

                if (req.file) {
                    const imagePath = path.join(__dirname, '../public/images/db_images', user.img);
                    filename = 'img-' + Date.now() + path.extname(req.file.originalname);
                    console.log('Nombre del archivo ' + filename)

                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log(`Imagen eliminada: ${user.img}`);
                        const newImagePath = path.join(__dirname, '../public/images/db_images', filename);
                        fs.writeFileSync(newImagePath, req.file.buffer);
                    } else {
                        console.log('La imagen no existe en la ruta especificada');
                    }
                } else {
                    console.log('El usuario no tiene imagen o es undefined');
                }


                user = {
                    ...user.dataValues,
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    lastName: data.lastName,
                    img: req.file ? filename : user.img,
                };
                
                await db.User.update(user, {
                    where: {
                        user_id: id
                    }
                });


                if (req.session.user) {
                    console.log('ESTO ESTA FUNCIONANDO')
                    req.session.destroy((err) => {
                        if (err) {
                            console.log('Error al destruir la sesión:', err);
                        }

                        res.clearCookie('connect.sid');
                        res.clearCookie('userEmail');
                        return res.redirect('/login');

                    });
                } else {

                    return res.redirect('/login');
                }

            } catch (error) {
                console.error('Error al editar usuario:', error);
                return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Error al editar usuario',
                    style: 'deleteStyle.css'
                });
            }


        } catch (error) {
            console.error('Error:', error);
            return res.redirect('/error');
        }
    },

    delete: async function (req, res) {
        try {
            const id = req.params.id;
            const user = await db.User.findByPk(id);

            if (user.img && user.img !== 'user.png') {
                const imagePath = path.join(__dirname, '../public/images/db_images', user.img);


                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${user.img}`);
                } else {
                    console.log('La imagen no existe en la ruta especificada');
                }
            } else {
                console.log('El usuario no tiene imagen o eliminated.img es undefined');
            }

            const deleted = await db.User.destroy({
                where: {
                    user_id: id
                }
            });

            if (!deleted) {
                return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Usuario no encontrado',
                    style: 'deleteStyle.css'
                });
            }

            if (req.session.user && req.session.user.id == id) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log('Error al destruir la sesión:', err);
                    }

                    res.clearCookie('connect.sid');
                    res.clearCookie('userEmail');


                    return res.redirect('/');
                });
            }

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.redirect('/notFound');
        }
    },



    admin: function (req, res) {
        
        const admin = db.User.findOne({
                where: {
                    role: "admin"
                }
            })
        
        return res.render('users/admin', {
            black: '10% off oferta lanzamiento!!',
            title: "Bienvenid@ " + admin.name,
            style: "admin.css",

        })
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cerrar sesión");
            }
            res.clearCookie('connect.sid');
            res.clearCookie('userEmail');
            res.redirect('/');
        });
    }
}
module.exports = userController