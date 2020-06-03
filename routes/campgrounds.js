const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// index
router.get('/', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// new
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// create
router.post('/', isLoggedIn, (req, res) => {
  // create a new campground and save to db
  Campground.create(req.body.campground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// show
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// middleware logic to make sure user is logged in before seeing/performing a request
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
