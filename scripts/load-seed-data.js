require('dotenv').config();
const client = require('../lib/db-client');
const bcrypt = require('bcryptjs');

const resort = [{
  resort_name: "timberline",
  coordinate_lat: "45.330688",
  coordinate_lon: "-121.709183",
  address: "something Address", 
  description: "cool place for stuff", 
  url: "someUrl"
}]
// const feedback = [{
//   comment: "this is a comment", 
//   ticket_price: "this is the ticket price", 
//   who: "i am a snowboarder", 
//   crowded:'No its empty', 
//   resort_id: "1",
//   profile_id: "1"

// }]

client.query(`
  INSERT INTO profile (username, hash)
  VALUES ($1, $2)
  RETURNING id;
`,

['snowy', bcrypt.hashSync('123', 8)]
)
  .then( result => {
    const profile = result.rows[0];

      return Promise.all(
        resort.map(skiresort => {
          return client.query(`
          INSERT INTO resort (resort_name, coordinate_lat, coordinate_lon, address, description, url)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
          `, 
            [skiresort.resort_name, skiresort.coordinate_lat, skiresort.coordinate_lon, skiresort.address, skiresort.description, skiresort.url])
        })
      );
  })
  .then(
    () => console.log('seed data load complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  })
