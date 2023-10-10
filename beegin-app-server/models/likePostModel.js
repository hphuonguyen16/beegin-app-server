const mongoose = require("mongoose");


const LikePostschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "A like must have a user"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
    required: [true, "A like must have a post"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LikePostModel = mongoose.model("LikePost", LikePostschema);

export default LikePostModel;
