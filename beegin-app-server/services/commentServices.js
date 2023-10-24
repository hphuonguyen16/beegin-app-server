const AppError = require("../utils/appError");
const Post = require("./../models/postModel");
const Comment = require("./../models/commentModel");
const CommentLike = require("./../models/commentLikeModel");

exports.createComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(data.post);
      if (!post) {
        reject(new AppError(`Post with id ${data.post} is no longer exist`));
      }

      const comment = await Comment.create({
        content: data.content,
        user: data.user,
        post: data.post,
      });

      resolve({
        status: "success",
        data: comment,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getCommentsOfPost = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(data.post);
      if (!post) {
        reject(new AppError(`Post with id ${data.post} is no longer exist`));
      }

      const comments = await Comment.find({ post: data.post }).populate({
        path: "user",
        populate: {
          path: "profile",
          model: "Profile",
          select: "name",
        },
      });

      resolve({
        status: "success",
        data: comments,
      });
    } catch (err) {
      reject(err);
    }
  });
};
exports.getComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.findById(id).populate({
        path: "user",
        populate: {
          path: "profile",
          model: "Profile",
          select: "name",
        },
      });

      resolve({
        status: "success",
        data: comment,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.updateComment = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await Comment.findById(id);
      if (checkComment.user.id !== data.user) {
        reject(
          new AppError(`You do not have permission to update this comment`, 403)
        );
      }
      const comment = await Comment.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!comment) {
        reject(new AppError(`Comment not found`, 404));
      }

      resolve({
        status: "success",
        data: comment,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.deleteComment = (id, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkComment = await Comment.findById(id);
      if (!checkComment) {
        reject(new AppError(`Comment not found`, 404));
      }
      if (checkComment.user.id !== user) {
        reject(
          new AppError(`You do not have permission to update this comment`, 403)
        );
      }
      const comment = await Comment.findOneAndDelete({ _id: id });

      resolve({
        status: "success",
        data: comment,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.likeComment = (commentId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if comment is still available
      const comment = await Comment.findById(commentId);
      if (!comment) {
        reject(new AppError(`Comment not found`, 404));
      }

      const commentLike = await CommentLike.create({
        comment: commentId,
        user: userId,
      });
      resolve({
        status: "success",
        data: commentLike,
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.unlikeComment = (commentId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await CommentLike.findOneAndDelete({ user: userId, comment: commentId });
      resolve({
        status: "sucess",
      });
    } catch (err) {
      reject(err);
    }
  });
};
