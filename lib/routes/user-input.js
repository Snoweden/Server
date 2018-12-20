const router = require('express').Router();
const client = require('../db-client');

router
  .post('/feedback', (req, res) => {

    const body = req.body;

    client.query(`
        INSERT INTO user_feedback (star_rating, comment, ticket_price, who, crowded, profile_id, resort_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `,
    [body.starRating, body.comment, body.ticketPrice, body.who, body.crowded, body.profileId, body.resortId]
    )
      .then(result => {
        res.json(result.rows[0]);

      });
  })

  .get('/stats', (req, res) => {
    console.log('backend ag data request', req);
    client.query(`
      SELECT 
        resort_id as "resortId",
        avg(star_rating) as "avg"
      FROM user_feedback
      GROUP BY resort_id
      ORDER BY "avg" ASC;
      `)
      .then(result => {
        console.log('BACKEND CALL', result);
        return res.json(result.rows);
      });
  });

module.exports = router;

// JOIN resort
//       SELECT 
//         resort_name as "resortName"
//       FROM resort
//       ON user_feedback.resort_id = resort.id