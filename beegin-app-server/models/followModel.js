import mongoose, { Schema, InferSchemaType } from "mongoose";

const FollowSchema = new Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FollowModel = mongoose.model("Follow", FollowSchema);

module.exports = FollowModel;
