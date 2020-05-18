const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const campgrounds = [
  {name: "Salmon Creek", image:"https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e5074417c287ad79448cd_340.jpg"},
  {name: "Yosemite", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e5074417c287ad79448cd_340.jpg"},
  {name: "Big Bear Lake", image: "https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e5074417c287ad79448cd_340.jpg"}
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = {name: name, image: image}
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("The YelpCamp Server Has Started!");
});
