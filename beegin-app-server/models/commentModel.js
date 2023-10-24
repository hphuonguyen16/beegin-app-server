const mongoose = require("mongoose");

const Post = require("./postModel");

const CommentSchema = new mongoose.Schema({
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

CommentSchema.statics.setNumComments = async function (postId) {
  let numComments = 0;
  numComments = await this.countDocuments({ post: postId });
  await Post.findByIdAndUpdate(postId, { numComments: numComments });
};

//update numComments of Post when a comment is created
CommentSchema.post("save", async function (doc, next) {
  if (doc) {
    await doc.constructor.setNumComments(doc.post);
  }
  next();
});

//update numComments of Post when a comment is deleted
CommentSchema.post(/^findByIdAndDelete/, async function (doc, next) {
  if (doc) {
    await doc.constructor.setNumComments(doc.post);
  }
  next();
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
