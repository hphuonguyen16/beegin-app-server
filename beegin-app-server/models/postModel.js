const mongoose = require("mongoose");

const Postschema = new mongoose.Schema({
  title: String,
  content: String,
  images: [
    {
      type: String,
      maxlength: [4, 'A post can only have up to 4 image'],
    },
  ],
  imageVideo: {
    type: String,
    maxlength: [1, 'A post can only have up to 1 video'],
  },
  categories: [
    //embedd category in post
    {
      name: String,
    },
  ],
  hashtags: [
    {
      name: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'A post must belong to a user'],
  },
  // sharedpost: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Post', // Reference to the Post model
  // },
  numLikes: {
    type: Number,
    default: 0,
  },
  numComments: {
    type: Number,
    default: 0,
  },
  numShares: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostModel = mongoose.model('Post', Postschema);

module.exports = PostModel;