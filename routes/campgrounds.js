const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

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
    } else {
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
            if (err) {
              console.log(err);
            } else {
              res.render('campgrounds/show', {campground: foundCampground});
            }
          });
});

// edit
router.get('/:id/edit', verifyCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/edit', {campground: foundCampground});
    }
  });
});

// update
router.put('/:id', verifyCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          console.log(err);
          res.redirect('/:id/edit');
        } else {
          res.redirect('/campgrounds/' + req.params.id);
        }
      });
});

// destroys campground and associated comments
router.delete('/:id', verifyCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
    if (err) {
      console.log(err);
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
          res.redirect('/campgrounds/' + req.params.id);
        } else {
          res.redirect('/campgrounds');
        }
      });
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

function verifyCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
