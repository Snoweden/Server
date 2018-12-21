const router = require('express').Router();
const client = require('../db-client');
const bcrypt = require('bcryptjs');
const jwt = require('../jwt');

function getProfileWithToken(profile) {
  return {
    id: profile.id,
    username: profile.username,
    token: jwt.sign({ id: profile.id })
  };
}

router
  .post('/feedback', (req, res) => {

    const body = req.body;

    client.query(`
        INSERT INTO user_feedback (star_rating, comment, ticket_price, who, crowded, profile_id, resort_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `,
    [body.starRating, body.comment, body.ticketPrice, body.who, body.crowded, body.profileId, body.resortId])
      .then(result => {
        res.json(result.rows[0]);
      });
  })

  .get('/stats', (req, res) => {
    client.query(`
    SELECT 
      avg(star_rating)::numeric(7,1),
      resort_name,
      resort_id
    FROM user_feedback
    JOIN resort
    ON user_feedback.resort_id = resort.id
    GROUP by resort_id, resort_name;
      `)
      .then(result => {
        return res.json(result.rows);
      });
  })

  .post('/star', (req, res) => {
    const body = req.body;

    client.query(`
        INSERT INTO user_feedback (star_rating, profile_id, resort_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `,
    [body.star, body.profileId, body.resortId])
      .then(result => {
        res.json(result.rows[0]);
      });
  })

  .put('/update-user', (req, res) => {
 
    const body = req.body;
    const username = body.username;
    const password = body.password;
    
    if(!username || !password) {
      res.status(400).json({ error: 'username and password required' });
      return;
    }

    client.query(`
      SELECT id
      FROM profile
      WHERE username = $1;
    `,
    [username])  
      .then(result => {
        if(result.rows.length > 0) {
          res.status(400).json({ error: 'username already exists' });
          return;
        }

        console.log('updating user profile...');

        client.query(`
          UPDATE profile 
            SET
              username = $1, 
              hash = $2
            WHERE id = $3
            RETURNING *;
        `,
        [username, bcrypt.hashSync(password, 8), body.id]
        )
          .then(result => {
            const profile = result.rows[0];
            res.json(getProfileWithToken(profile));
          });
      });
  });

module.exports = router;