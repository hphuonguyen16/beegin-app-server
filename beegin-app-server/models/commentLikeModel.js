import mongoose, { Schema, InferSchemaType } from "mongoose";

const CommentLikeSchema = new Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", // Reference to the Comment model
    required: [true, "A comment like must have a comment"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "A comment like must have a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentLikeModel = mongoose.model("CommentLike", CommentLikeSchema);

module.exports = CommentLikeModel;
