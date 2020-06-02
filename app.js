const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const app = express();

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

seedDB();

// passport config
app.use(require('express-session')({
  secret: 'aton123',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that will run for every route to pass in the username/username._id for navbar links
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// index
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// create
app.post('/campgrounds', isLoggedIn, (req, res) => {
  // create a new campground and save to db
  Campground.create(req.body.campground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// show
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// ===============
// comments route
// ===============
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, newComment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(newComment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});
// ===============

// ===============
// auth routes
// ===============
// user registration
app.get('/sign_up', (req, res) => {
  res.render('users/sign_up');
});

app.post('/sign_up', (req, res) => {
  const newUser = new User({username: req.body.username});

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/sign_up');
    }
    passport.authenticate('local')(req, res, () =>{
      res.redirect('/campgrounds');
    });
  });
});

// user login
app.get('/login', (req, res) => {
  res.render('users/login');
});

app.post('/login', passport.authenticate('local',
    {
      successRedirect: '/campgrounds',
      failureRedirect: '/login',
    }), (req, res) => {
});

// user logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// middleware logic to make sure user is logged in before seeing/performing a request
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
// ===============

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
