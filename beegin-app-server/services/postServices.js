const Post = require("./../models/postModel");
const LikePost = require("./../models/likePostModel");
const User = require("./../models/userModel");
const HashtagPost = require("./../models/hashtagPostModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Hashtag = require("./../models/hashtagModel");

const checkDeletingPermission = async (postId, reject, userId) => {
  // admins always have permission to delete post
  const user = await User.findById(userId);
  if (user.role === "admin") {
    return true;
  }
  const post = await Post.findById(postId);
  if (!post) {
    reject(new AppError(`Post not found`, 404));
  } else if (post.user != userId) {
    reject(
      new AppError(`You do not have permission to perform this action`, 403)
    );
  } else if (!post.isActived) {
    reject(new AppError(`This post is longer existed`, 404));
  } else {
    return true;
  }
};

const checkPost = async (postId, reject, userId = null) => {
  const post = await Post.findById(postId);
  if (!post) {
    reject(new AppError(`Post not found`, 404));
  } else if (userId && post.user.toString() !== userId) {
    // only user of the post has permission to update post
    reject(
      new AppError(`You do not have permission to perform this action`, 403)
    );
  } else if (!post.isActived) {
    reject(new AppError(`This post is longer existed`, 404));
  } else {
    return true;
  }
};

exports.createPost = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.create({
        content: data.content,
        images: data.images,
        imageVideo: data.imageVideo,
        categories: data.categories,
        user: data.user,
      });
      await post.populate("user");
      await post.populate('categories');
      resolve({
        status: "success",
        data: post,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.updatePost = (postId, userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (await checkPost(postId, reject, userId)) {
        const post = await Post.findByIdAndUpdate(postId, data, {
          new: true,
          runValidators: true,
        });

        if (!post) {
          reject(new AppError(`Post not found`, 404));
        }

        resolve({
          status: "success",
          data: post,
        });
      }
      resolve({
        status: "success",
        data: post,
      });
    } catch (err) {
      reject(err);
    }
  });
};
exports.deletePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((await checkDeletingPermission(postId, reject, userId)) === true) {
        const doc = await Post.findByIdAndUpdate(postId, { isActived: false });

        if (!doc) {
          reject(new AppError(`You did not like this post before`, 400));
        }

        resolve({
          status: "success",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(id)
        .populate("user")
        .populate({
          path: "user",
          select: "_id email profile",
          populate: {
            path: "profile",
            model: "Profile",
            select: "avatar firstname lastname -user",
          },
        });
      if (!post) {
        reject(new AppError(`Post not found`, 404));
      } else if (!post.isActived) {
        reject(new AppError(`This post is longer existed`, 404));
      } else {
        resolve({
          status: "success",
          data: post,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostsByMe = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ user: userId })
        .populate({
          path: "user",
          select: "_id email profile",
          populate: {
            path: "profile",
            model: "Profile",
            select: "avatar firstname lastname",
          },
        })
        .sort({ createdAt: -1 });
      resolve({
        status: "success",
        results: posts.length,
        data: posts,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.isPostLikedByUser = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isLiked = (await LikePost.exists({ post: postId, user: userId }))
        ? true
        : false;
      resolve({
        status: "success",
        data: isLiked,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.likePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((await checkPost(postId, reject)) === true) {
        const likePost = await LikePost.create({
          post: postId,
          user: userId,
        });

        resolve({
          status: "success",
          data: likePost,
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

exports.unlikePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((await checkPost(postId, reject)) === true) {
        const doc = await LikePost.findOneAndDelete({
          user: userId,
          post: postId,
        });

        if (!doc) {
          reject(new AppError(`You did not like this post before`, 400));
        }

        resolve({
          status: "success",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostsByHashtag = (hashtag, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!hashtag) {
        reject(`Hashtag empty`, 400);
      }
      hashtag = "#" + hashtag;
      console.log(hashtag);
      const hashtagId = await Hashtag.find({
        name: { $regex: new RegExp(hashtag, "i") },
      });
      console.log(hashtagId);
      const hashtagPosts = await HashtagPost.find({
        hashtag: hashtagId[0]._id,
      });
      if (!hashtagPosts) {
        reject(new AppError(`Not found`, 404));
      }
      const postIds = hashtagPosts.map((post) => post.post.toString());

      console.log(postIds);
      const postFeatures = new APIFeatures(
        Post.find({ _id: { $in: postIds } }),
        query
      )
        // .filter()
        .limitFields()
        .sort()
        .paginate();
      postFeatures.query = postFeatures.query.populate({
        path: "user",
        select: "_id email profile",
        populate: {
          path: "profile",
          model: "Profile",
          select: "avatar firstname lastname",
        },
      });
      const posts = await postFeatures.query;
      console.log("----------------------------", posts);
      resolve({
        status: "success",
        results: posts.length,
        data: posts,
      });
    } catch (err) {
      reject(err);
    }
  });
};
