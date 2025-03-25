const facebookConfig = require("../config/facebook");
const { handleMessage } = require("../utils/handleMessage.js");
const Page = require("../models/Page");
// Verify webhook
exports.verifyWebhook = (req, res) => {
  console.log(req);
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Webhook verification request received");
  console.log(`Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

  if (mode && token) {
    if (mode === "subscribe" && token === facebookConfig.webhookVerifyToken) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      console.log("Webhook verification failed");
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(400);
  }
};

exports.handleWebhook = async (req, res) => {
  const body = req.body;
  if (body.object === "page") {
    try {
      for (const entry of body.entry) {
        console.log(`Processing entry for page: ${entry.id}`);

        if (entry.messaging) {
          const page = await Page.findOne({ pageId: entry.id }); // Fetch the page here

          for (const event of entry.messaging) {
            console.log("Event received:", event);

            if (event.message && page) {
              await handleMessage(event, page);
            } else {
              console.error("Page not found for event:", entry.id);
            }
          }
        }
      }
      res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      res.status(500).send("Error processing webhook");
    }
  } else {
    res.sendStatus(404);
  }
};
