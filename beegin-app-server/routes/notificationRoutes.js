const express = require("express");
const notiController = require("./../controllers/notificationController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(notiController.getNotificationsByUser)
  .post(notiController.createNotifications);

module.exports = router;
