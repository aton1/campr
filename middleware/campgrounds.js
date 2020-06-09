const Campground = require('../models/campground');
const campgroundMiddlewareObj = {};

// middleware logic for user authorization
campgroundMiddlewareObj.verifyCampgroundOwnership = (req, res, next) => {
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

module.exports = campgroundMiddlewareObj;
