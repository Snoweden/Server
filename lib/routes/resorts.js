const router = require('express').Router();
const client = require('../db-client');

router 

  .get('/', (req, res) => {
    client.query(`
      SELECT * FROM resort;
    `)
      .then(result => {
        res.json(result.rows);
      });
  })

  .get('/locations', (req, res) => {

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

  .get('/stats', (req, res) => {
    client.query(`
      SELECT 
        avg(star_rating)::numeric(7,1),
        resort_name,
        resort_id
      FROM user_feedback
      JOIN resort
      ON user_feedback.resort_id = resort.id
      GROUP by resort_id, resort_name;
    `)
      .then(result => {
        return res.json(result.rows);
      });
  })

  .get('/:id', (req, res) => {
    client.query(`
      SELECT 
        id,
        resort_name,
        coordinate_lat,
        coordinate_lon,
        address,
        description, 
        url
    FROM resort WHERE id = $1;
    ;`, 
    [req.params.id])
      .then(result => {
        res.json(result.rows[0]);
      });
  });
  
module.exports = router;