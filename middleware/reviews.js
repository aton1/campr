const Review = require('../models/review');
const Campground = require('../models/campground');
const reviewMiddlewareObj = {}

reviewMiddlewareObj.checkReviewOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, (err, foundReview) => {
      if (err || !foundReview) {
        console.log(err);
        req.flash('error', 'Review not found');
        res.redirect(`/campgrounds/${req.params.id}/reviews`);
      } else {
        if (foundReview.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Insufficient Permissions');
          res.redirect(`/campgrounds/${req.params.id}/reviews`);
        }
      }
    });
  } else {
    req.flash('error', 'Must be logged in');
    res.redirect('back');
  }
};

reviewMiddlewareObj.checkReviewExists = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id).populate('reviews').exec((err, foundCampground) => {
      if (err || !foundCampground) {
        console.log(err);
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        const foundUserReview = foundCampground.reviews.some((review) => {
          return review.author.id.equals(req.user._id);
        });
        if (foundUserReview) {
          req.flash('error', 'You already reviewed this campground');
          return res.redirect(`/campgrounds/${foundCampground._id}/reviews`);
        }
        next();
      }
    });
  } else {
    req.flash('error', 'Must be logged in');
    res.redirect('back');
  }
};

module.exports = reviewMiddlewareObj;
