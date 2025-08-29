const db = require('../database/models');

const apiUserController = {
    getAll: async (req, res) => {
        const users = await db.User.findAll();
        const cleanUsers = users.map(user => ({
            id: user.user_id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            detail: `http://localhost:3000/api/users/${user.user_id}`
        }))
        const quantity = users.length;
        res.json({
            data : cleanUsers,
            quantity
        });
        
    },
    getById: async (req, res) => {
        const user = await db.User.findByPk(req.params.id);
        const cleanUser = {
            id: user.user_id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            image: `http://localhost:3000/images/users/${user.img}`
        }
        res.json({cleanUser})
    }
}





module.exports = apiUserController;