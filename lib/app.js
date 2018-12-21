const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth');
const jwt = require('./jwt');
const map = require('./routes/map');
const userInput = require('./routes/user-input');
const feedback = require('./routes/feedback');

// enhanced logging
app.use(morgan('dev'));

// serve public director as static files:
app.use(express.static('public'));

// register the json "middleware" body parser
app.use(express.json());

// eslint-disable-next-line no-unused-vars
function checkAuth(req, res, next) {
  const token = req.get('Authorization');
  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }

  let payload = null;
  try {
    payload = jwt.verify(token);
  }
  catch (err) {
    // this code runs with verify fails
    res.status(401).json({ error: 'invalid token' });
    return;  
  }

  req.userId = payload.id;
  next();
}

// register our routes
app.use('/api/auth', auth);
app.use('/api/map', map);
app.use('/api/userinput', checkAuth, userInput);
app.use('/api/feedback', checkAuth, feedback);
// test route:
const client = require('./db-client');

app.get('/api', (req, res) => {
  client.query(`
    SELECT * from profile;
  `)
    .then(result => res.json(result.rows));
});

module.exports = app;