const fs = require('fs');
const path = require('path');

const users = require('../data/users.json');

const usersPath = path.join(__dirname, '../data/users.json');


let userController = {


    register: function (req, res) {
        return res.render('users/register', { title: 'Ratón Blanco', style: 'registerStyle.css' });
    },
    login: function (req, res) {
        return res.render('users/login', { title: 'Ratón Blanco', style: 'loginStyle.css' });
    },
    storeUser: function (req, res) {
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

        const data = req.body;
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            email: data.email,
            password: data.password,
            name: data.name,
            lastName: data.lastName,
            type: "user"
            
        }

        users.push(newUser);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

        return res.redirect('/')
    },

    admin: function (req, res){
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        
        
        const admin = users.filter(u => u.type === "admin"); 
        console.log(admin.name)
        return res.render('users/admin', {
            title: "Bienvenido " + admin[0].name,
            style: "admin.css",
            
        })
    }
}

module.exports = userController