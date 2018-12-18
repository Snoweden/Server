require('dotenv').config();
const client = require('../lib/db-client');

client.query(`
DROP TABLE IF EXISTS user_feedback;
DROP TABLE IF EXISTS resort;
DROP TABLE IF EXISTS profile;
`)
  .then(
    () => console.log('drop tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });