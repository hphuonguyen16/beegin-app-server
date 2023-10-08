import mongoose, { Schema, InferSchemaType } from "mongoose";

const CommentSchema = new Schema({
  content: {
    type: String,
    required: [true, "Please provide a Comment name"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "A comment must belong to a user"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
    required: [true, "A comment must belong to a post"],
  },
  numLikes: {
    type: Number,
    default: 0,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // Reference to the Comment model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
