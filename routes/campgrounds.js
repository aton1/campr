const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const campgroundMiddleware = require('../middleware/campgrounds');

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
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// create
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get username and id from params to populate author object defined in campground model
  const author = {
    id: req.user._id,
    username: req.user.username,
  };

  // grab campground schema and associate it to the form data
  const newCampground = {
    name: req.body.campground.name,
    image: req.body.campground.image,
    description: req.body.campground.description,
    author: author,
  };

  // create a new campground and save to db
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Unable to create campground');
      res.redirect('/new');
    } else {
      req.flash('success', 'Successfully added campground');
      res.redirect('/campgrounds');
    }
  });
});

// show
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
      .populate('comments')
      .exec(
          (err, foundCampground) => {
            if (err || !foundCampground) {
              console.log(err);
              req.flash('error', 'Campground not found');
              res.redirect('/campgrounds');
            } else {
              res.render('campgrounds/show', {campground: foundCampground});
            }
          });
});

// edit
router.get('/:id/edit', campgroundMiddleware.verifyCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/edit', {campground: foundCampground});
    }
  });
});

// update
router.put('/:id', campgroundMiddleware.verifyCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          console.log(err);
          req.flash('error', 'Unable to edit campground');
          res.redirect('/:id/edit');
        } else {
          req.flash('success', 'Successfully updated campground');
          res.redirect('/campgrounds/' + req.params.id);
        }
      });
});

// destroys campground and associated comments
router.delete('/:id', campgroundMiddleware.verifyCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Unable to delete campground');
      res.redirect('/campgrounds/' + req.params.id);
    } else {
      Comment.deleteMany({
        _id:
        {
          $in: removedCampground.comments,
        },
      }, (err) => {
        if (err) {
          console.log(err);
          req.flash('error', 'Unable to delete comments');
          res.redirect('/campgrounds/' + req.params.id);
        } else {
          req.flash('success', 'Successfully deleted campground and comments');
          res.redirect('/campgrounds');
        }
      });
    }
  });
});

module.exports = router;
