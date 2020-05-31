const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      seedDB = require("./seeds"),
      app = express();

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

seedDB();

// index
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  // get all campgrounds from db 
  Campground.find({}, (err, allCampgrounds) => {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// create
app.post("/campgrounds", (req, res) => {
  // create a new campground and save to db
  Campground.create(req.body.campground, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// show
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});

// ===============
// comments route
app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  })
});

app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, newComment) => {
        if(err){
          console.log(err);
        } else {
          campground.comments.push(newComment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
// ===============

app.listen(3000, () => {
  console.log("The YelpCamp Server Has Started!");
});
