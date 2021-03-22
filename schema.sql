  
-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL
  password TEXT NOT NULL
  is_admin INTEGER NULL
);


CREATE TABLE post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES user (id)
);

CREATE TABLE partner (
  partner_id INTEGER PRIMARY KEY AUTOINCREMENT,
  comercial_name TEXT NOT NULL,
  first_name TEXT NOT NULL, 
  last_name TEXT NOT NULL,
  vat TEXT,
  street  TEXT, 
  phone  TEXT,
  emial  TEXT, 
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  write TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  

);