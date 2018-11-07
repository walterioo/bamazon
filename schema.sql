DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Xbox One X", "Video Games", 499.99, 52);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Play Station Pro", "Video Games", 459.99, 119);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Samsung 60 4K OLED TV", "Televisions", 1299.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Bamazon Lightning Cable", "Bamazon Basics", 19.99, 848);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Bamazon Ergonomic Keyboard", "Bamazon Basics", 49.99, 67);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Bamazon Office Chair", "Bamazon Basics", 249.99, 230);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Rescue Bots Boulder", "Toys", 19.99, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Paw Patrol Marshall", "Toys", 9.99, 45);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("GTX 2080 Ti", "Electronics", 1049.99, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("SSD 480GB", "Electronics", 199.99, 18);