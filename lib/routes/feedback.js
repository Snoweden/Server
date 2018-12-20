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
        resort_id,
        profile_id,
        profile.id as "profileId",
        profile.username as username
      FROM user_feedback
      JOIN profile
      ON user_feedback.profile_id = profile.id
      WHERE user_feedback.resort_id = $1;
    `,
    [req.params.id])
      .then(result => {
        return res.json(result.rows);
      });
  });

module.exports = router;