const axios = require("axios");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Page = require("../models/Page");
const facebookConfig = require("../config/facebook");

const handleMessage = async (event, page) => {
  try {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageTimestamp = new Date(event.timestamp);

    console.log(`New message from ${senderId}: ${messageText}`);

    // Get sender profile from Facebook
    let senderProfile = { name: "Unknown", profile_pic: null };
    try {
      const profileResponse = await axios.get(
        `${facebookConfig.graphApiBaseUrl}/${senderId}`,
        {
          params: {
            fields: "name,profile_pic",
            access_token: page.pageAccessToken,
          },
        }
      );
      senderProfile = profileResponse.data;
    } catch (error) {
      console.error("Error getting sender profile:", error.message);
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      pageId: page.pageId,
      customerId: senderId,
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!conversation || conversation.lastMessageTime < twentyFourHoursAgo) {
      conversation = await Conversation.create({
        pageId: page.pageId,
        customerId: senderId,
        customerName: senderProfile.name,
        customerPicture: senderProfile.profile_pic,
        lastMessageTime: messageTimestamp,
        isRead: false,
      });
    } else {
      conversation.lastMessageTime = messageTimestamp;
      conversation.isRead = false;
      await conversation.save();
    }

    // Save message to the database
    await Message.create({
      conversationId: conversation._id,
      senderId: senderId,
      senderType: "customer",
      content: messageText,
      timestamp: messageTimestamp,
    });

    console.log(`Saved message from ${senderProfile.name}: ${messageText}`);
  } catch (error) {
    console.error("Error handling message:", error);
  }
};

exports.handleMessage = handleMessage;
