const middlewareObj = {};

// middleware logic to make sure user is logged in before seeing/performing a request
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = middlewareObj;
