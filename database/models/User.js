module.exports = function (sequelize, dataTypes) {
    let alias = 'User';

    let cols = {
        user_id : {
            autoIncrement : true,
            primaryKey : true,
            type : dataTypes.INTEGER
        },
        email : {
            type : dataTypes.STRING
        },
        password : {
            type : dataTypes.STRING(100)
        },
        name : {
            type : dataTypes.STRING
        },
        lastName : {
            type : dataTypes.STRING
        },
        role : {
            type : dataTypes.STRING(100)
        },
        img : {
            type : dataTypes.STRING(150)
        }

    }

    let config = {
        tableName : 'users',
        timestamps : false,
        //underscored : true
    }


    const user = sequelize.define(alias, cols, config);
    return user;
}