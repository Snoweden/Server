const router = require('express').Router();
const client = require('../db-client');

router 
    .get('/markers', (req, res) => {

        client.query(`
        SELECT * 
        FROM resort;
        `)
        .then(result => {
            res.json(result.rows);
        });

    });
    module.exports = router;