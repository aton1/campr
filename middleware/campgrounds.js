const Campground = require('../models/campground');
const campgroundMiddlewareObj = {};

// middleware logic for user authorization
campgroundMiddlewareObj.verifyCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        console.log(err);
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Insufficient permissions');
          res.redirect('/campgrounds');
        }
      }
    });
  } else {
    req.flash('error', 'You are not logged in');
    res.redirect('/campgrounds');
  }
}

module.exports = campgroundMiddlewareObj;
