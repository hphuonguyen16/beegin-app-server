const mongoose = require("mongoose");

const Notificationschema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "A notification must belong to a user"],
  },
  type: {
    type: String,
    enum: [
      "follow",
      "comment",
      "like post",
      "like comment",
      "reply comment",
      "message",
    ],
    required: [true, "Notification type must be declared"],
  },
  actors: [
    {
      type: String,
    },
  ],
  image: String,
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    require: [true, "A notification must contain content id"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model("Notification", Notificationschema);

module.exports = NotificationModel;
