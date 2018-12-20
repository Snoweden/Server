const router = require('express').Router();
const client = require('../db-client');
const bcrypt = require('bcryptjs');


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
      avg(star_rating),
      resort_name,
      resort_id
    FROM user_feedback
    JOIN resort
    ON user_feedback.resort_id = resort.id
    GROUP by resort_id, resort_name;
      `)
      .then(result => {
        console.log('BACKEND CALL', result);
        return res.json(result.rows);
      });
  })
  .put('/updateUsername', (req, res) => {
    console.log('you have updated a username');

    const body = req.body;
    console.log('body', body);
    client.query(`
    UPDATE profile 
    SET 
      username = $1, 
      hash = $2 
    WHERE id = $3

    RETURNING username, id;`,
    
    [body.username, bcrypt.hashSync(body.password, 8), req.userId])
      .then(result => {
        res.json(result.rows[0]);
      });
  });

module.exports = router;