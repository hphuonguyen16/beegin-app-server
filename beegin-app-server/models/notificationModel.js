const mongoose = require("mongoose");

const Notificationschema = new mongoose.Schema(
  {
    recipient: {
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
    subContentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

Notificationschema.index({ recipient: 1 });
const NotificationModel = mongoose.model("Notification", Notificationschema);

module.exports = NotificationModel;
