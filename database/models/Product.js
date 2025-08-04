module.exports = function (sequelize, dataTypes) {
    let alias = 'Products';

    let cols = {
        product_id : {
            autoIncrement : true,
            primaryKey : true,
            type : dataTypes.INTEGER
        },
        name : {
            type : dataTypes.STRING
        },
        description : {
            type : dataTypes.STRING
        },
        material : {
            type : dataTypes.STRING
        },
        img : {
            type : dataTypes.STRING(150)
        },
        category : {
            type : dataTypes.STRING
        },
        price : {
            type : dataTypes.INTEGER
        },

    }

    let config = {
        tableName : 'products',
        timestamps : false,
        //underscored : true
    }


    const product = sequelize.define(alias, cols, config);
    return product;
}