const express = require("express");
const trendingController = require("./../controllers/trendingController");

const router = express.Router();

// router.route("/hashtags").get(trendingController.getAllTrendingHashtag);
router
  .route("/hashtags")
  .get(trendingController.setLimit, trendingController.getTrendingHashtag);
module.exports = router;