require("dotenv").config();

module.exports = {
  graphApiVersion: "v18.0",
  graphApiBaseUrl: "https://graph.facebook.com/v18.0",
  webhookVerifyToken: process.env.FB_VERIFY_TOKEN,
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET,
  required_permissions: [
    "pages_messaging",
    "pages_manage_metadata",
    "pages_read_engagement",
  ],
};
