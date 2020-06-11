const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');
const methodOverride = require('method-override');
const app = express();

// requiring routes
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/campr', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

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

// middleware that will run for every route to pass in the username/username._id
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// using required routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);

app.listen(3000, () => {
  console.log('campr. server started');
});
