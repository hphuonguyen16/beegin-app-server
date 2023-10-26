const AppError = require("../utils/appError");
const Post = require("./../models/postModel");
const Comment = require("./../models/commentModel");
const CommentLike = require("./../models/commentLikeModel");

const checkPost = async (postId, reject) => {
  const post = await Post.findById(postId);
  if (!post) {
    reject(new AppError(`Post not found`, 404));
  } else if (!post.isActived) {
    reject(new AppError(`This post is longer existed`, 404));
  } else {
    return true;
  }
};

exports.createComment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const post = await Post.findById(data.post);
      // if (!post) {
      //   reject(new AppError(`Post with id ${data.post} is no longer exist`));
      // }
      if ((await checkPost(data.post, reject)) === true) {
        const comment = await Comment.create({
          content: data.content,
          user: data.user,
          post: data.post,
        });

        resolve({
          status: "success",
          data: comment,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.getCommentsOfPost = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ((await checkPost(data.post, reject)) === true) {
        const comments = await Comment.find({ post: data.post });

        resolve({
          status: "success",
          results: comments.length,
          data: comments,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
exports.getComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.findById(id);

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
      const doc = await CommentLike.findOneAndDelete({
        user: userId,
        comment: commentId,
      });
      if (!doc) {
        reject(new AppError(`You did not like this comment before`, 400));
      }
      resolve({
        status: "sucess",
      });
    } catch (err) {
      reject(err);
    }
  });
};
