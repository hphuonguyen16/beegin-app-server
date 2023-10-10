const mongoose = require("mongoose");

const Notificationschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'A notification must belong to a user'],
  },
  content: {
    type: String,
    required: [true, 'Please provide a notification content'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model('Notification', Notificationschema);

module.exports = NotificationModel;