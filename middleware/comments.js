const Comment = require('../models/comment');
const commentMiddlewareObj = {};

commentMiddlewareObj.verifyCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        console.log(err);
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Insufficient permissions');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You are not logged in');
    res.redirect('back');
  }
}

module.exports = commentMiddlewareObj;
