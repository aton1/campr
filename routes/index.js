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
      req.flash('error', err.message);
      return res.redirect('/sign_up');
    }
    passport.authenticate('local')(req, res, () =>{
      req.flash('success', 'Welcome to campr. ' + user.username + '!');
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
      successFlash: "Successfully signed in",
      failureRedirect: '/login',
      failureFlash: true
    }), (req, res) => {
});

// user logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully signed out');
  res.redirect('/campgrounds');
});

module.exports = router;
