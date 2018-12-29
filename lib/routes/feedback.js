const router = require('express').Router();
const client = require('../db-client');

router
  .get('/:id', (req, res) => {
    client.query(`
      SELECT
        user_feedback.id as "commentId",
        star_rating,
        comment,
        ticket_price,
        resort_id as "resortId",
        profile_id,
        profile.id as "profileId",
        profile.username as username
      FROM user_feedback
      JOIN profile
      ON user_feedback.profile_id = profile.id
      WHERE user_feedback.resort_id = $1;
    `,
    [req.params.id])
      .then(result => res.json(result.rows));
  })

  .post('/', (req, res) => {
    const body = req.body;

    client.query(`
        INSERT INTO user_feedback (star_rating, comment, ticket_price, who, crowded, profile_id, resort_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `,
    // you CAN NOT trust anything but the token to tell you current user!
    [body.starRating, body.comment, body.ticketPrice, body.who, body.crowded, req.userId, body.resortId])
      .then(result => {
        res.json(result.rows[0]);
      });
  })

  // Not sure why you have two ways to post feedback.
  // This should probably be a put and use an UPDATE...
  .put('/:id/star', (req, res) => {
    const body = req.body;

    client.query(`
        INSERT INTO user_feedback (star_rating, profile_id, resort_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `,
    // you CAN NOT trust anything but the token to tell you current user!
    [body.star, req.userId, req.params.id])
      .then(result => {
        res.json(result.rows[0]);
      });
  })

  .delete('/:id', (req, res) => {
    // you need to make sure user is deleting own feedback!
    client.query(`
      DELETE from user_feedback 
      WHERE id = $1
      AND profile_id = $2;
    `,
    [req.params.id, req.userId]);
    res.json();
  });

module.exports = router;