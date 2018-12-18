const router = require('express').Router();
const client = require('../db-client');

router
    .post('/feedback', (req, res) => {
        const body = req.body;

        client.query(`
            INSERT INTO user_feedback (comment, ticket_price, who, crowded, resort_id, profile_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING comment, ticket_price, who, crowded;
        `,
        [body.comment, body.ticketPrice, body.who, body.crowded]
        )
            .then(result => {
                res.json(result.rows[0]);

            });
    });