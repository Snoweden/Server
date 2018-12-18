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

  });
module.exports = router;