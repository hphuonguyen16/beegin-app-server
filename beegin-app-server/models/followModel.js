const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
     required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FollowModel = mongoose.model("Follow", FollowSchema);

module.exports = FollowModel;
