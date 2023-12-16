const express = require("express");
const trendingController = require("./../controllers/trendingController");
const authController = require("./../controllers/authController");
const router = express.Router();

// router.route("/hashtags").get(trendingController.getAllTrendingHashtag);
router
  .route("/hashtags")
  .get(trendingController.setLimit, trendingController.getTrendingHashtag);

router
  .route("/posts")
  .get(authController.protect, trendingController.getTrendingPosts);
module.exports = router;
