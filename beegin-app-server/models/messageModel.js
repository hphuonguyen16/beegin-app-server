const mongoose = require("mongoose");

const Messageschema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'A message must have a sender'],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'A message must have a receiver'],
  },
  type: {
    type: String,
    required: [true, 'Please provide a message type'],
  },
  content: {
    type: String,
    required: [true, 'Please provide a message content'],
  },
  status: {
      type: String,
      default: "sent",
      enum: ["sent", "delivered", "seen"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = mongoose.model('Message', Messageschema);

module.exports = MessageModel;

