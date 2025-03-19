const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    pageId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    customerName: String,
    customerPicture: String,
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
