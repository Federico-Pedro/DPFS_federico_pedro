const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const bcrypt = require('bcryptjs');




const getUsers = () => {
    return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}





let userController = {


    register: function (req, res) {
        return res.render('users/register', { title: 'Ratón Blanco', style: 'registerStyle.css', black: '10% off oferta lanzamiento!!', oldData: {} });
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


        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            email: data.email,
            password: hashedPassword,
            name: data.name,
            lastName: data.lastName,
            type: "user",
            img: req.file ? req.file.filename : 'user.png',

        }

        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

        return res.render('users/login', {
            title: '',
            black: 'Usuario registrado con éxito',
            style: 'loginStyle.css',
            message: '',
            passwordMessage: ''

        });
    },

    profile: function (req, res) {
        const email = req.params.email;
        const users = getUsers();
        const user = users.filter(u => u.email === email);

        return res.render('users/profile', {
            black: '10% off oferta lanzamiento!!',
            id: user[0].id,
            title: "Bienvenido " + user[0].name,
            email: email,
            name: user[0].name,
            lastName: user[0].lastName,
            img: user[0].img,
            style: "profilestyle.css",

        })

    },

    editUser: function (req, res) {
        const id = Number(req.params.id);
        const users = getUsers();
        const user = users.find(u => id === u.id);
        console.log(user)
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
        if (data.password && data.password.trim() !== "") {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(data.password, salt);
        }



        users[userIndex] = {
            ...users[userIndex],
            email: data.email,
            password: hashedPassword,
            name: data.name,
            lastName: data.lastName,
            img: req.file ? req.file.filename : users[userIndex].img,

        };


        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');


        return res.redirect(`/profile/${data.email}`)
    },

    delete: function (req, res) {
        const id = Number(req.params.id);
        const users = getUsers();

        const allUsers = users.filter(p => p.id !== id);
        const eliminated = users.filter(p => p.id === id);


        if (eliminated.length < 1) {
            return res.render('products/notFound', {
                black: '10% off oferta lanzamiento!!',
                title: 'Usuario no encontrado',
                style: 'deleteStyle.css'
            })
        } else {


            fs.writeFileSync(usersPath, JSON.stringify(allUsers, null, 2), 'utf-8');

            return res.render('products/notFound', {
                black: '10% off oferta lanzamiento!!',
                title: 'Usuario eliminado con exito',
                style: 'deleteStyle.css'
            })
        }


    },

    admin: function (req, res) {
        const users = getUsers();


        const admin = users.filter(u => u.type === "admin");
        console.log(admin.name)
        return res.render('users/admin', {
            black: '10% off oferta lanzamiento!!',
            title: "Bienvenido " + admin[0].name,
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
            img: user.img
        };
        return res.render('users/profile', {
            title: 'Perfil',
            style: 'profilestyle.css',
            black: 'Bienvenido a Raton Blanco',
            img: req.session.user.img,
            name: req.session.user.name,
            lastName: req.session.user.lastName,
            email: req.session.user.email,
            id: req.session.user.id,
            user: req.session.user
        });

    }
}
module.exports = userController