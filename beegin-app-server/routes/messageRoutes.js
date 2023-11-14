const express = require("express");
const router = express.Router();

const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController')


router.use(authController.protect);

router.get("/get-friends-and-recent-message", messageController.getFriendsAndRecentMessage);

router.get("/get-chat-images/:id", messageController.getChatImages);

router
    .route("/:id")
    .get(messageController.getFriendMessages)
    .post(messageController.sendMessage)
    .delete(messageController.deleteMessage)
    .put(messageController.updateMessageStatus)

module.exports = router;