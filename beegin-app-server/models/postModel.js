const mongoose = require("mongoose");
const Category = require("./categoryModel");
const Hashtag = require("./hashtagModel");
const HashtagPost = require("./hashtagPostModel");

const PostSchema = new mongoose.Schema(
  {
    // title: String,
    content: String,
    images: {
      type: [String],
      validate: {
        validator: (array) => array.length <= 4,
        message: "A post can have only up to 4 images",
      },
    },
    imageVideo: {
      type: String,
      // maxlength: [1, "A post can only have up to 1 video"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to the Post model
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "A post must belong to a user"],
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
    isActived: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories",
    select: "-createdAt -__v",
  });
  next();
});

PostSchema.pre("save", async function (next) {
  if (this.content) {
    const hashtags = this.content.match(/#(\w+)/g);
    if (hashtags?.length > 0) {
      const promises = hashtags.map(async (element) => {
        let hashtag = await Hashtag.findOne({ name: element });
        if (!hashtag) {
          hashtag = await Hashtag.create({ name: element });
        }
        await HashtagPost.create({ hashtag: hashtag._id, post: this._id });
      });
      await Promise.all(promises);
    }
  }
  next();
});

PostSchema.pre("findOneAndUpdate", async function (next) {
  const updatedFields = this.getUpdate();
  if (updatedFields.content) {
    const postId = this.getFilter();
    const post = await this.model.findOne(this.getFilter());

    const oldHashtags = post.content.match(/#(\w+)/g) || [];
    console.log("old", oldHashtags);
    const newHashtags = updatedFields.content.match(/#(\w+)/g) || [];
    console.log("new", newHashtags);
    // Find hashtags that were removed
    const removedHashtags = oldHashtags.filter(
      (oldHashtag) => !newHashtags.includes(oldHashtag)
    );
    console.log("removed", removedHashtags);
    // Find hashtags that are new
    const addedHashtags = newHashtags.filter(
      (newHashtag) => !oldHashtags.includes(newHashtag)
    );
    console.log("added", addedHashtags);
    // Delete old hashtagPosts
    const deletePromise = removedHashtags.map(async (element) => {
      let hashtag = await Hashtag.findOne({ name: element });
      if (hashtag) {
        await HashtagPost.findByIdAndDelete(hashtag._id);
      }
    });
    await Promise.all(deletePromise);

    // add new hashtagPost
    const promises = addedHashtags.map(async (element) => {
      let hashtag = await Hashtag.findOne({ name: element });
      if (!hashtag) {
        hashtag = await Hashtag.create({ name: element });
      }
      await HashtagPost.create({ hashtag: hashtag._id, post: postId });
    });
    await Promise.all(promises);
  }
  next();
});
const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
