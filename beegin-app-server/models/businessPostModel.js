const mongoose = require("mongoose");
import { PostModel } from './postModel';

const BusinessPostschema = new mongoose.Schema({
  price: Number,
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending',
  },
  // title: String,
  // content: String,
  // images: [
  //   {
  //     type: String,
  //     maxlength: [4, 'A BusinessPost can only have up to 4 image'],
  //   },
  // ],
  // imageVideo: {
  //   type: String,
  //   maxlength: [1, 'A BusinessPost can only have up to 1 video'],
  // },
  // categories: [
  //   //embedd category in BusinessPost
  //   {
  //     name: String,
  //   },
  // ],
  // hashtags: [
  //   {
  //     name: String,
  //   },
  // ],
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to the User model
  //   required: [true, 'A BusinessPost must belong to a user'],
  // },
  // sharedpost: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'BusinessPost', // Reference to the BusinessPost model
  // },
  // numLikes: {
  //   type: Number,
  //   default: 0,
  // },
  // numComments: {
  //   type: Number,
  //   default: 0,
  // },
  // numShares: {
  //   type: Number,
  //   default: 0,
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

const BusinessPostModel = PostModel.discriminator(
  'BusinessPost',
  BusinessPostschema,
);

module.exports = BusinessPostModel;