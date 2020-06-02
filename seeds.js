const mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment");

const data = [
  { name: "Cloud's Rest", 
    image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_1280.jpg",
    description: "Nulla bibendum dolor tincidunt, venenatis mi ac, bibendum metus. Donec dolor ante, scelerisque vitae augue vel, rutrum tristique felis. Pellentesque sed est eu sem venenatis bibendum. Aliquam malesuada aliquam tortor quis laoreet. Integer ut libero lorem. Etiam aliquet interdum magna, a semper lectus congue sit amet. Nam at nunc viverra ex tristique pulvinar. Curabitur vestibulum diam a rhoncus venenatis. Mauris sem ligula, efficitur pharetra magna vitae, vehicula condimentum urna. Etiam accumsan nunc in libero pellentesque pulvinar. Vivamus aliquam neque quis sapien congue ultrices. Proin rhoncus magna at quam scelerisque pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque convallis massa sed lacus iaculis, eu convallis libero pharetra. Donec rhoncus bibendum risus vel dictum."
  },
  { name: "Canyon", 
    image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929_1280.jpg",
    description: "Nulla bibendum dolor tincidunt, venenatis mi ac, bibendum metus. Donec dolor ante, scelerisque vitae augue vel, rutrum tristique felis. Pellentesque sed est eu sem venenatis bibendum. Aliquam malesuada aliquam tortor quis laoreet. Integer ut libero lorem. Etiam aliquet interdum magna, a semper lectus congue sit amet. Nam at nunc viverra ex tristique pulvinar. Curabitur vestibulum diam a rhoncus venenatis. Mauris sem ligula, efficitur pharetra magna vitae, vehicula condimentum urna. Etiam accumsan nunc in libero pellentesque pulvinar. Vivamus aliquam neque quis sapien congue ultrices. Proin rhoncus magna at quam scelerisque pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque convallis massa sed lacus iaculis, eu convallis libero pharetra. Donec rhoncus bibendum risus vel dictum."
  },
  { 
  name: "Fire Treat", 
  image: "https://cdn.pixabay.com/photo/2019/10/03/11/14/camp-4522970_1280.jpg",
  description: "Nulla bibendum dolor tincidunt, venenatis mi ac, bibendum metus. Donec dolor ante, scelerisque vitae augue vel, rutrum tristique felis. Pellentesque sed est eu sem venenatis bibendum. Aliquam malesuada aliquam tortor quis laoreet. Integer ut libero lorem. Etiam aliquet interdum magna, a semper lectus congue sit amet. Nam at nunc viverra ex tristique pulvinar. Curabitur vestibulum diam a rhoncus venenatis. Mauris sem ligula, efficitur pharetra magna vitae, vehicula condimentum urna. Etiam accumsan nunc in libero pellentesque pulvinar. Vivamus aliquam neque quis sapien congue ultrices. Proin rhoncus magna at quam scelerisque pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque convallis massa sed lacus iaculis, eu convallis libero pharetra. Donec rhoncus bibendum risus vel dictum."
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
