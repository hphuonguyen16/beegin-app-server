const mongoose = require("mongoose");
const pusher = require("./../utils/pusherObject");

const NotificationSchema = new mongoose.Schema(
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
        "share post",
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

NotificationSchema.index({ recipient: 1 });

NotificationSchema.post("save", async function (doc, next) {
  const channel = doc.recipient.toString();
  await pusher.trigger(channel, "notifications:new", doc);
  next();
});
const NotificationModel = mongoose.model("Notification", NotificationSchema);

module.exports = NotificationModel;
