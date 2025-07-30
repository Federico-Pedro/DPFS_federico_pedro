const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const bcrypt = require('bcryptjs');


const getUsers = () => {
    return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}



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

    storeUser: function (req, res) {
        const users = getUsers();
        const data = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const mailExists = users.some(user => user.email === data.email);
        if (mailExists) {
            return res.render('users/register', {
                title: '',
                black: 'Ese mail ya está registrado',
                style: 'registerStyle.css',
                oldData: data
            });
        }

        const filename = 'img-' + Date.now() + path.extname(req.file.originalname);
        const imagePath = path.join(__dirname, '../public/images/db_images', filename);

        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            email: data.email,
            password: hashedPassword,
            name: data.name,
            lastName: data.lastName,
            type: "user",
            img: req.file ? filename : 'user.png',

        }

        users.push(newUser);

        fs.writeFileSync(imagePath, req.file.buffer);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

        return res.redirect('/login');
    },

    editUser: function (req, res) {
        const id = Number(req.params.id);
        const users = getUsers();
        const user = users.find(u => id === u.id);

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

    updateUser: function (req, res) {
        let users = getUsers();
        const id = Number(req.params.id);
        const data = req.body;
        const userIndex = users.findIndex(u => u.id === id);


        let hashedPassword = users[userIndex].password;

        if (data.password === '') {
            hashedPassword = hashedPassword;
        } else if (data.password && data.password.trim() !== "") {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(data.password, salt);
        }


        //SI LA IMAGEN ES ACTUALIZADA BORRA LA ANTERIOR, ESTO TODAVIA NO FUNCIONA
        let filename;
        try {

            if (req.file) {
                const imagePath = path.join(__dirname, '../public/images/db_images', users[userIndex].img);
                filename = 'img-' + Date.now() + path.extname(req.file.originalname);
                console.log('Nombre del archivo' + filename)

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${users[userIndex].img}`);
                    const newImagePath = path.join(__dirname, '../public/images/db_images', filename);
                    fs.writeFileSync(newImagePath, req.file.buffer);
                } else {
                    console.log('La imagen no existe en la ruta especificada');
                }
            } else {
                console.log('El usuario no tiene imagen o es undefined');
            }


            users[userIndex] = {
                ...users[userIndex],
                email: data.email,
                password: hashedPassword,
                name: data.name,
                lastName: data.lastName,
                img: req.file ? filename : users[userIndex].img,
            };

            fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');


            req.session.user = {
                id: users[userIndex].id,
                name: users[userIndex].name,
                lastName: users[userIndex].lastName,
                email: users[userIndex].email,
                img: users[userIndex].img,
                type: users[userIndex].type
            };




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

    },

    delete: function (req, res) {
        const id = Number(req.params.id);
        const users = getUsers();

        const eliminated = users.find(p => p.id === id);
        const allUsers = users.filter(p => p.id !== id);

        if (!eliminated) {
            return res.render('products/notFound', {
                black: '10% off oferta lanzamiento!!',
                title: 'Usuario no encontrado',
                style: 'deleteStyle.css'
            });
        }

        try {

            if (eliminated.img && eliminated.img !== 'user.png') {
                const imagePath = path.join(__dirname, '../public/images/db_images', eliminated.img);


                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log(`Imagen eliminada: ${eliminated.img}`);
                } else {
                    console.log('La imagen no existe en la ruta especificada');
                }
            } else {
                console.log('El usuario no tiene imagen o eliminated.img es undefined');
            }


            fs.writeFileSync(usersPath, JSON.stringify(allUsers, null, 2), 'utf-8');


            if (req.session.userLogged && req.session.userLogged.id === id) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log('Error al destruir la sesión:', err);
                    }

                    res.clearCookie('connect.sid');
                    res.clearCookie('userEmail');


                    return res.redirect('/');
                });
            } else {

                return res.render('products/notFound', {
                    black: '10% off oferta lanzamiento!!',
                    title: 'Usuario eliminado con éxito',
                    style: 'deleteStyle.css'
                });
            }

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return res.render('products/notFound', {
                black: '10% off oferta lanzamiento!!',
                title: 'Error al eliminar usuario',
                style: 'deleteStyle.css'
            });
        }
    },

    admin: function (req, res) {
        const users = getUsers();
        console.log(users);
        const admin = users.find(u => u.type === "admin");
        console.log(admin.name)
        return res.render('users/admin', {
            black: '10% off oferta lanzamiento!!',
            title: "Bienvenida " + admin.name,
            style: "admin.css",

        })
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

    loginUser: function (req, res) {
        const data = req.body;
        const users = getUsers();
        const user = users.find(user => user.email === data.email);
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
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            img: user.img,
            type: user.type
        };
        const remember = data.remember;
        if (remember) {
            res.cookie('userEmail', user.email, { maxAge: 1000 * 60 * 60 * 24 * 7 });
        }
        return res.redirect('/profile')
    },

    profile: (req, res) => {
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

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cerrar sesión");
            }
            res.clearCookie('userEmail');
            res.redirect('/');
        });
    }
}
module.exports = userController