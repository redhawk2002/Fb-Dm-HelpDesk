const axios = require("axios");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Page = require("../models/Page");
const facebookConfig = require("../config/facebook");

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    // Get user's pages
    const pages = await Page.find({
      userId: req.user.id,
      connected: true,
    });

    if (pages.length === 0) {
      return res.json([]);
    }

    // Get pageIds
    const pageIds = pages.map((page) => page.pageId);

    // Get conversations for these pages
    const conversations = await Conversation.find({
      pageId: { $in: pageIds },
    }).sort({ lastMessageTime: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Get conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user has access to this conversation
    const page = await Page.findOne({
      userId: req.user.id,
      pageId: conversation.pageId,
      connected: true,
    });

    if (!page) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Mark as read
    if (!conversation.isRead) {
      conversation.isRead = true;
      await conversation.save();
    }

    // Get messages
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send reply
exports.sendReply = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Get conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user has access
    const page = await Page.findOne({
      userId: req.user.id,
      pageId: conversation.pageId,
      connected: true,
    });

    if (!page) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Send message via Facebook API
    await axios.post(
      `${facebookConfig.graphApiBaseUrl}/me/messages`,
      {
        recipient: { id: conversation.customerId },
        message: { text: message },
      },
      {
        params: { access_token: page.pageAccessToken },
      }
    );

    // Save message to database
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      senderType: "agent",
      content: message,
      timestamp: new Date(),
    });

    // Update conversation
    conversation.lastMessageTime = new Date();
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send reply error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
