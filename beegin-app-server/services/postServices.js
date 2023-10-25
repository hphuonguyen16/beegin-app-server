const Post = require("./../models/postModel");
const LikePost = require("./../models/likePostModel");
const AppError = require("./../utils/appError");

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
      const post = await Post.findById(postId);
      if (!post) {
        reject(new AppError(`Post not found`, 404));
      }

      if (!post.isActived) {
        reject(new AppError(`This post is longer existed`, 404));
      }

      const doc = await Post.findByIdAndUpdate(postId, { isActived: false });

      if (!doc) {
        reject(new AppError(`You did not like this post before`, 400));
      }

      resolve({
        status: "success",
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getPostById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(id).populate({
        path: "user",
        select: "_id email profile",
        populate: {
          path: "profile",
          model: "Profile",
          select: "name avatar fullname",
        },
      });
      if (!post) {
        reject(new AppError(`Post not found`, 404));
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

exports.likePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        reject(new AppError(`Post not found`, 404));
      }

      if (!post.isActived) {
        reject(new AppError(`This post is longer existed`, 404));
      }

      const likePost = await LikePost.create({
        post: postId,
        user: userId,
      });

      resolve({
        status: "success",
        data: likePost,
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

exports.unlikePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        reject(new AppError(`Post not found`, 404));
      }

      if (!post.isActived) {
        reject(new AppError(`This post is longer existed`, 404));
      }

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
    } catch (err) {
      reject(err);
    }
  });
};
