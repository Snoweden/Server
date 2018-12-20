const router = require('express').Router();
const client = require('../db-client');

router
  .get('/:id', (req, res) => {
    client.query(`
      SELECT * 
      FROM user_feedback
      JOIN profile
      ON user_feedback.profile_id = profile.id
      WHERE user_feedback.resort_id = $1;
    `,
    [req.params.id])
      .then(result => {
        console.log('joined result', result);
        return res.json(result.rows);
      });
  });

module.exports = router;