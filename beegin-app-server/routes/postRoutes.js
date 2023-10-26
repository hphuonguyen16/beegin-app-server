const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const commentRouters = require("./commentRoutes");
const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(postController.getAllPost)
  .post(postController.setUserId, postController.createPost);

router
  .route("/:id")
  .get(postController.getPostById)
  .delete(postController.deletePost);

router
  .route("/:id/like")
  .post(authController.restrictTo("user", "business"), postController.likePost)
  .delete(
    authController.restrictTo("user", "business"),
    postController.unlikePost
  );
//combine route with comment
//ex /api/v1/post/postId/comment/
router.use("/:postId/comments", commentRouters);
module.exports = router;
