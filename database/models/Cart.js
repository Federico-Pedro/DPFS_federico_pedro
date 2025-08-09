module.exports = function (sequelize, dataTypes) {
    let alias = 'Cart';

    let cols = {
        cart_id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        user_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', 
                key: 'user_id' 
            }
        },
        
        status: {
            type: dataTypes.STRING(50)
        },
        


    }

    let config = {
        tableName: 'cart',
        timestamps: false,
        //underscored : true
    }


    const cart = sequelize.define(alias, cols, config);
    return cart;
}