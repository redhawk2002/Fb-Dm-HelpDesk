const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pageId: {
      type: String,
      required: true,
    },
    pageName: {
      type: String,
      required: true,
    },
    pageAccessToken: {
      type: String,
      required: true,
    },
    connected: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
