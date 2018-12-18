const router = require('express').Router();
const client = require('../db-client');

router
    .post('/feedback', (req, res) => {
        console.log(req.body);
        const body = req.body;

        client.query(`
            INSERT INTO user_feedback (comment, profile_id, resort_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,
        [body.comment, body.profile_id, body.resort_id]
        )
            .then(result => {
                res.json(result.rows[0]);

            });
    });
    module.exports = router;