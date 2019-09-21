CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password CHAR(192)
)
