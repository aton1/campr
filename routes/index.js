const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// index - root route
router.get('/', (req, res) => {
  res.render('landing');
});

// user registriation
router.get('/sign_up', (req, res) => {
  res.render('users/sign_up');
});

router.post('/sign_up', (req, res) => {
  const newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/sign_up');
    }
    passport.authenticate('local')(req, res, () =>{
      res.redirect('/campgrounds');
    });
  });
});

// user login
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
    }), (req, res) => {
});

// user logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
