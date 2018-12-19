const router = require('express').Router();
const client = require('../db-client');

router
  .get('/:id', (req, res) => {
    client.query(`
      SELECT * 
      FROM user_feedback
      WHERE resort_id = $1;
    `,
    [req.params.id])
      .then(result => res.json(result.rows));
  });

module.exports = router;