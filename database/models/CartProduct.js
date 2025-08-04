module.exports = function (sequelize, dataTypes) {
    let alias = 'CartProduct';

    let cols = {
        cartProduct_id: {
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTEGER
        },
        cart_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cart', 
                key: 'cart_id' 
            }
        },
        product_id: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Product', 
                key: 'product_id' 
            }
        }


    }

    let config = {
        tableName: 'cartProduct',
        timestamps: true,
        //underscored : true
    }


    const cartProduct = sequelize.define(alias, cols, config);
    return cartProduct;
}