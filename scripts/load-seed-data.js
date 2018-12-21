require('dotenv').config();
const client = require('../lib/db-client');
const bcrypt = require('bcryptjs');
const resort = require('./resorts.json');

client.query(`
  INSERT INTO profile (username, hash)
  VALUES ($1, $2)
  RETURNING id;
`,
['snowy', bcrypt.hashSync('123', 8)])
  .then(() => {
    return Promise.all(
      resort.map(skiresort => {
        return client.query(`
        INSERT INTO resort (resort_name, coordinate_lat, coordinate_lon, address, description, url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
        `, 
        [skiresort.resort_name, skiresort.coordinate_lat, skiresort.coordinate_lon, skiresort.address, skiresort.description, skiresort.url]);
      })
    );
  })
  .then(
    () => console.log('seed data load complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });