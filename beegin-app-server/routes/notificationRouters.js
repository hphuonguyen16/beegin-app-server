const express = require('express');
const notificationController = require('./../controllers/notificationController');
const authController = require('./../controllers/authController');


const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router
  .route("/")
  .get(authController.restrictTo("user", "business"),notificationController.getAllNotification)



module.exports = router;