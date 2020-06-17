const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const middleware = require('../middleware');
const reviewMiddleware = require('../middleware/reviews');

// index
router.get('/', (req, res) => {
  Campground.findById(req.params.id).populate({
    path: 'reviews',
    options: {sort: {createdAt: -1}}
  }).exec((err, foundCampground) => {
    if (err || !foundCampground) {
      console.log(err);
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
    }
    res.render('reviews/index', {campground: foundCampground});
  });
});

// new
router.get('/new', middleware.isLoggedIn, reviewMiddleware.checkReviewExists, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.render('reviews/new', {campground: foundCampground});
  });
});

// create
router.post('/', middleware.isLoggedIn, reviewMiddleware.checkReviewExists, (req, res) => {
  Campground.findById(req.params.id)
    .populate('reviews')
    .exec((err, foundCampground) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      return res.redirect('back');
    }
    const review = {
      rating: req.body.review.rating,
      text: req.body.review.text,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
      campground: foundCampground,
    }
    Review.create(review, (err, newReview) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Review could not be created');
        return res.redirect('back');
      }
      newReview.save();
      foundCampground.reviews.push(newReview);
      foundCampground.rating = calcAvg(foundCampground.reviews);
      foundCampground.save();
      req.flash('success', 'Successfully added review for campground');
      res.redirect(`/campgrounds/${foundCampground._id}/reviews`);
    });
  });
});

// edit
router.get('/:review_id/edit', middleware.isLoggedIn, reviewMiddleware.checkReviewOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      console.log(err);
      req.flash('error', 'Campground not found');
      return res.redirect('/campgrounds');
    }
    Review.findById(req.params.review_id, (err, foundReview) => {
      if (err) {
        console.log(err);
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.render('reviews/edit', {campground: foundCampground, review: foundReview});
    });
  });
});

// update
router.put('/:review_id', middleware.isLoggedIn, reviewMiddleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndUpdate(
    req.params.review_id,
    req.body.review,
    {new: true},
    (err, review) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Review could not be updated');
        return res.redirect('back');
      }
      Campground.findById(req.params.id)
        .populate('reviews')
        .exec((err, foundCampground) => {
          if (err) {
            console.log(err);
            req.flash('error', 'Campground not found');
            return res.redirect('back');
          }
          foundCampground.rating = calcAvg(foundCampground.reviews);
          foundCampground.save();
          req.flash('success', 'Successfully updated review for campground');
          res.redirect(`/campgrounds/${foundCampground._id}/reviews`);
      })
    });
});

// destroy
router.delete('/:review_id', middleware.isLoggedIn, reviewMiddleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndRemove(req.params.review_id, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Review could not be deleted');
      return res.redirect('back');
    }
    Campground.findByIdAndUpdate(req.params.id,
      {$pull: {reviews: req.params.review_id}},
      {new: true}).populate('reviews').exec((err, foundCampground) => {
        if (err || !foundCampground) {
          console.log(err);
          req.flash('error', 'Campground could not be updated');
          return res.redirect('back');
        }
        foundCampground.rating = calcAvg(foundCampground.reviews);
        foundCampground.save();
        req.flash('success', 'Successfully deleted review');
        res.redirect(`/campgrounds/${req.params.id}/reviews`);
      });
  });
});

function calcAvg(reviews) {
  if (reviews.length === 0) {
    return 0;
  }
  let sum = 0;
  reviews.forEach((x) => {
    sum += x.rating;
  });
  return sum / reviews.length;
}

module.exports = router;
