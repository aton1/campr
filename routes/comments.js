const express = require('express');
// mergeParams: true is needed in order to find the specified campground
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
const commentMiddleware = require('../middleware/comments');

// new
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// create
router.post('/', middleware.isLoggedIn, (req, res) => {
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
          req.flash('error', 'Unable to create comment');
        } else {
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          req.flash('success', 'Successfully added comment');
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// edit
router.get('/:comment_id/edit', commentMiddleware.verifyCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect('/campgrounds');
      } else {
        res.render('comments/edit', {campground_id: foundCampground._id, comment: foundComment});
      }
    });
  });
});

// update
router.put('/:comment_id', commentMiddleware.verifyCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id, 
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Unable to update comment');
        res.redirect('/:comment_id');
     } else {
        req.flash('success', 'Successfully updated comment');
        res.redirect(`/campgrounds/${req.params.id}`);
      }
    }); 
});

// destroy
router.delete('/:comment_id', commentMiddleware.verifyCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(
    req.params.comment_id, 
    (err, removedComment) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Unable to delete comment');
        res.redirect('/:comment_id');
      } else {
        req.flash('success', 'Successfully deleted comment');
        res.redirect(`/campgrounds/${req.params.id}`);
      }
  });
});

module.exports = router;
