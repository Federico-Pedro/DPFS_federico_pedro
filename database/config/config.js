module.exports = {
  "development": {
    "username": "root",
    "password": "root", 
    "database": "ratonblanco",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test", 
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": parseInt(process.env.DB_PORT),
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": true
      }
    }
  }
}
