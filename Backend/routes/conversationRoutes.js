const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendReply,
} = require("../controllers/conversationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/conversations", authMiddleware, getConversations);
router.get("/:conversationId/messages", authMiddleware, getMessages);
router.post("/:conversationId/reply", authMiddleware, sendReply);

module.exports = router;
