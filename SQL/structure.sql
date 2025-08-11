CREATE DATABASE ratonblanco;
USE ratonblanco;

CREATE TABLE users (
	user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    img VARCHAR(150) NOT NULL  
);

CREATE TABLE products (
	product_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    material VARCHAR(500) NOT NULL,
    img VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL
    );
    
CREATE TABLE cart (
	cart_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    status VARCHAR(50),
    createdAt DATETIME
);

CREATE TABLE cartProduct (
cartProduct_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
cart_id INT NOT NULL,
product_id INT NOT NULL,
FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
FOREIGN KEY (product_id) REFERENCES products(product_id)
)
     