const express = require("express");
const commentController = require("./../controllers/commentController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(commentController.setUserPostId, commentController.getCommentsOfPost)
  .post(
    authController.restrictTo("user"),
    commentController.setUserPostId,
    commentController.createComment
  );

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(
    authController.restrictTo("user", "admin"),
    commentController.updateComment
  )
  .delete(
    authController.restrictTo("user", "admin"),
    commentController.deleteComment
  );

router
  .route("/:id/like")
  .post(
    authController.restrictTo("user", "business"),
    commentController.setUserPostId,
    commentController.likeComment
  )
  .delete(
    authController.restrictTo("user", "business"),
    commentController.unlikeComment
  );

module.exports = router;
