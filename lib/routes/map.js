const router = require('express').Router();
const client = require('../db-client');

router 
    .get('/markers', (req, res) => {

        client.query(`
        SELECT 
            coordinate_lat, 
            coordinate_lon
        FROM resort;
        `)
        .then(result => {
            console.log('results from map', result.rows);
            res.json(result.rows);
        });

    });
    module.exports = router;


//     coordinate_lat FLOAT NOT NULL,
//   coordinate_lon FLOAT NOT NULL,