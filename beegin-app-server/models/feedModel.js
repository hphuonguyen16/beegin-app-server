const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dateToBeSeen: {
    type: Date,
  },
});

const FeedModel = mongoose.model("Feed", FeedSchema);

module.exports = FeedModel;
