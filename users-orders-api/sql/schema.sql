CREATE DATABASE orders_db;

-- Connect to orders_db, then:

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

INSERT INTO users (name, email)
VALUES
('Abhishek', 'abhishek@example.com'),
('Rahul', 'rahul@example.com'),
('Priya', 'priya@example.com');

INSERT INTO orders (user_id, item, amount, status)
VALUES
(1, 'Nike Shoes', 4999, 'completed'),
(1, 'T-Shirt', 999, 'pending'),
(2, 'Laptop', 65000, 'completed'),
(1, 'Watch', 3500, 'cancelled'),
(3, 'Headphones', 2500, 'pending');