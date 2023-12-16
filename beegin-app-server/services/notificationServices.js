const Notification = require("./../models/notificationModel");
const AppError = require("./../utils/appError");
const Profile = require("./../models/profileModel");
const Post = require("./../models/postModel");
const Comment = require("./../models/commentModel");
const APIFeatures = require("./../utils/apiFeatures");
exports.getNotificationsByUser = (userId, query, all = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        return reject(new AppError(`Please enter user id`, 400));
      }

      let filter = { recipient: userId };
      if (!all) {
        filter.read = false;
      }
      const features = new APIFeatures(Notification.find(filter), query)
        .sort()
        .paginate();

      const data = await features.query;

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
exports.createNotifications = (
  recipient,
  actors,
  contentId,
  image,
  type,
  subContentId = null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!recipient || !actors || !type || !contentId) {
        return reject(new AppError(`Please fill all requied fields`, 400));
      }

      const data = await Notification.create({
        actors: actors,
        recipient: recipient,
        contentId: contentId,
        type: type,
        image: image,
        subContentId: subContentId,
      });

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createFollowNotification = (
  followerId,
  followingId,
  type = "follow"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!followerId || !followingId) {
        return reject(new AppError(`Please fill all required fields`, 400));
      }

      const follower = await Profile.findOne({ user: followerId });

      if (!follower) {
        return reject(new AppError(`Follower's profile not found`, 400));
      }

      const following = await Profile.findOne({ user: followingId });
      if (!following) {
        return reject(new AppError(`following's profile not found`, 400));
      }

      const notification = await this.createNotifications(
        followingId,
        [follower.slug],
        followerId,
        follower.avatar,
        type
      );
      console.log(notification);
      resolve(notification);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createLikePostNotification = (likerId, postId, type = "like post") => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!likerId || !postId) {
        return reject(new AppError(`Please fill all required fields`, 400));
      }

      const liker = await Profile.findOne({ user: likerId });

      if (!liker) {
        return reject(new AppError(`Liker's profile not found`, 404));
      }

      const post = await Post.findById(postId);

      if (!post) {
        return reject(new AppError(`Post not found`, 404));
      }

      if (!likerId === post.user._id.toString()) {
        return reject(
          new AppError(`You can not create notification for yourself`, 400)
        );
      }
      let likePostNotification;

      likePostNotification = await Notification.findOne({
        recipient: post.user._id.toString(),
        contentId: postId,
        type: type,
      });

      if (!likePostNotification) {
        likePostNotification = await this.createNotifications(
          post.user._id.toString(),
          [liker.slug],
          postId,
          liker.avatar,
          type
        );
      } else {
        likePostNotification.actors.push(liker.slug);
        likePostNotification.image = liker.avatar;
        await likePostNotification.save();
      }

      resolve(likePostNotification);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createCommentPostNotification = (
  commentId,
  postId,
  type = "comment"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!commentId || !postId) {
        return reject(new AppError(`Please fill all required fields`, 400));
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return reject(new AppError(`Comment not found`, 404));
      }

      const post = await Post.findById(postId);

      if (!post) {
        return reject(new AppError(`Post not found`, 404));
      }

      let commentNotification;

      commentNotification = await Notification.findOne({
        recipient: post.user._id.toString(),
        contentId: postId,
        type: type,
      });

      if (!commentNotification) {
        commentNotification = await this.createNotifications(
          post.user._id.toString(),
          [comment.user.profile.slug],
          postId,
          comment.user.profile.avatar,
          type,
          commentId
        );
      } else {
        commentNotification.actors.push(comment.user.profile.slug);
        commentNotification.image = comment.user.profile.avatar;
        commentNotification.subContentId = commentId;
        await commentNotification.save();
      }

      resolve(commentNotification);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createLikeCommentNotification = (
  likerId,
  commentId,
  type = "like comment"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!likerId || !commentId) {
        return reject(new AppError(`Please fill all required fields`, 400));
      }

      const liker = await Profile.findOne({ user: likerId });

      if (!liker) {
        return reject(new AppError(`Liker's profile not found`, 404));
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return reject(new AppError(`Comment not found`, 404));
      }

      let likeCommentNotification;

      likeCommentNotification = await Notification.findOne({
        recipient: comment.user._id.toString(),
        contentId: comment._id.toString(),
        type: type,
      });

      if (!likeCommentNotification) {
        likeCommentNotification = await this.createNotifications(
          comment.user._id.toString(),
          [liker.slug],
          commentId,
          liker.avatar,
          type
        );
      } else {
        likeCommentNotification.actors.push(liker.slug);
        likeCommentNotification.image = liker.avatar;
        await likeCommentNotification.save();
      }

      resolve(likeCommentNotification);
    } catch (err) {
      reject(err);
    }
  });
};

exports.createReplyCommentNotification = (
  commentId,
  type = "reply comment"
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!commentId) {
        return reject(new AppError(`Please fill all required fields`, 400));
      }

      const comment = await Comment.findById(commentId).populate("parent");
      if (!comment) {
        return reject(new AppError(`Comment not found`, 404));
      }

      let replyCommentNotification;

      replyCommentNotification = await Notification.findOne({
        recipient: comment.parent.user._id.toString(),
        contentId: comment.parent._id.toString(),
        type: type,
      });

      if (!replyCommentNotification) {
        replyCommentNotification = await this.createNotifications(
          comment.parent.user._id.toString(),
          [comment.user.profile.slug],
          comment.parent._id.toString(),
          comment.user.profile.avatar,
          type,
          commentId
        );
      } else {
        replyCommentNotification.actors.push(comment.user.profile.slug);
        replyCommentNotification.image = comment.user.profile.avatar;
        replyCommentNotification.subContentId = commentId;
        await replyCommentNotification.save();
      }

      resolve(replyCommentNotification);
    } catch (err) {
      reject(err);
    }
  });
};
