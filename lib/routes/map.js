const router = require('express').Router();
const client = require('../db-client');

router 
  .get('/markers', (req, res) => {

    client.query(`
        SELECT
            id, 
            coordinate_lat, 
            coordinate_lon
        FROM resort;
        `)
      .then(result => {
        res.json(result.rows);
      });

  })
  .get('/resort/:id', (req, res) => {
    client.query(`
      SELECT 
        id,
        resort_name,
        coordinate_lat,
        coordinate_lon,
        address, 
        description, 
        url
    FROM resort WHERE id = $1
    ;`, 
    [req.params.id])
      .then(result => {
        res.json(result.rows[0]);
      });
  })
  .get('/resortall', (req, res) => {
    client.query(`
      SELECT * FROM resort;
    `)
      .then(result => {
        res.json(result.rows);
      });
  });
  
module.exports = router;