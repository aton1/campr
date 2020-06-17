const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: 'Provide a rating from 1-5.',
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer.',
    },
  },
  text: {
    type: String,
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  campground: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campground',
  },
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);
