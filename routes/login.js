const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
  const userDataPath = path.join(__dirname, '../data/users.json');
  const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));

  const user = userData.find((user) => user.username === username && user.password === password);

  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Invalid username or password' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get('/', (req, res, next) => {
  res.render('login', { user: req.user || null, message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/memes',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

module.exports = router;
