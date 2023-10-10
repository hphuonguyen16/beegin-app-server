const mongoose = require("mongoose");


const HashtagPostschema = new mongoose.Schema({
  hashtag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hashtag", // Reference to the Hashtag model
    required: [true, "A hashtag post must have a hashtag"],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
    required: [true, "A hashtag post must have a post"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HashtagPostModel = mongoose.model("HashtagPost", HashtagPostschema);

export default HashtagPostModel;