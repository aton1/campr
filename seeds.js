const mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment");

const data = [
  { name: "Cloud's Rest", 
    image: "https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e50744075277dd39e48cd_340.png",
    description: "blah blah blah"
  },
  { name: "Canyon", 
    image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e50744075277dd39e48cd_340.jpg",
    description: "blah blah blah"
  },
  { 
  name: "Fire Treat", 
  image: "https://pixabay.com/get/52e3d5404957a514f1dc84609620367d1c3ed9e04e50744075277dd39e48cd_340.jpg",
  description: "blah blah blah"
  }
];

function seedDB(){
  // remove all campgrounds
  Campground.deleteMany({}, (err) => {
       if(err){
           console.log(err);
       }
       console.log("removed campgrounds!");
       Comment.deleteMany({}, (err) => {
           if(err){
               console.log(err);
           }
           console.log("removed comments!");
            // add a few campgrounds
           data.forEach((seed) => {
               Campground.create(seed, (err, campground) =>{
                   if(err){
                       console.log(err)
                   } else {
                       console.log("added a campground");
                       //create a comment
                       Comment.create(
                           {
                               text: "This place is great, but I wish there was internet",
                               author: "Homer"
                           }, (err, comment) => {
                               if(err){
                                   console.log(err);
                               } else {
                                   campground.comments.push(comment);
                                   campground.save();
                                   console.log("Created new comment");
                               }
                           });
                   }
               });
           });
       });
   }); 
}

module.exports = seedDB;
