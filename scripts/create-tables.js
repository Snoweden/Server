require('dotenv').config();
const client = require('../lib/db-client');

client.query(`
  CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    username VARCHAR(256) NOT NULL,
    hash VARCHAR(256) NOT NULL
  );
  CREATE TABLE IF NOT EXISTS resort (
    id SERIAL PRIMARY KEY,
    resortname VARCHAR(256) NOT NULL,
    coordinate_lat FLOAT NOT NULL,
    coordinate_lon FLOAT NOT NULL,
    address VARCHAR(256), 
    description VARCHAR(256), 
    url VARCHAR(256)
  )
`)
  .then(
    () => console.log('create tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });