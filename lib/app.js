const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth');
const jwt = require('./jwt');
const map = require('./routes/map');
const userInput = require('./routes/user-input');
const feedback = require('./routes/feedback');

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

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
    res.status(401).json({ error: 'invalid token' });
    return;  
  }

  req.userId = payload.id;
  next();
}

app.use('/api/auth', auth);
app.use('/api/map', map);
app.use('/api/userinput', checkAuth, userInput);
app.use('/api/feedback', checkAuth, feedback);

module.exports = app;