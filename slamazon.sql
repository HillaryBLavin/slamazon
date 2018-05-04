DROP DATABASE IF EXISTS slamazonDB;

CREATE DATABASE slamazonDB;

USE slamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (100) NOT NULL,
    department_name VARCHAR (25) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Lion King", "Movies & TV", 18.75, 150),
    ("Beauty & the Beast", "Movies & TV", 19.99, 210),
    ("Rick and Morty Season 3", "Movies & TV", 39.99, 70),
    ("Women's Vintage Polka Dot Cocktail Dress", "Apparel", 35.99, 25),
    ("Men's Charcoal Trousers", "Apparel", 45.00, 45),
    ("Kids' Doc McStuffins T-Shirt", "Apparel", 12.99, 80),
    ("Kids' Optimus Prime T-Shirt", "Apparel", 12.99, 72),
    ("65-Inch 4K Smart LED TV", "Electronics", 999.99, 15),
    ("Ripple Smart Speaker with Selexa", "Electronics", 99.99, 42),
    ("Bluetooth Sound Bar", "Electronics", 79.99, 38);

SELECT * FROM slamazonDB.products;