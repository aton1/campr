const express = require('express');
// mergeParams: true is needed in order to find the specified campground
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// comments new
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// comments create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // add username and id to comment
      const comment = {
        text: req.body.comment.text,
        author: {
          id: req.user._id,
          username: req.user.username,
        },
      };

      Comment.create(comment, (err, newComment) => {
        if (err) {
          console.log(err);
        } else {
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
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

module.exports = router;
