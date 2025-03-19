const axios = require("axios");
const User = require("../models/User");
const Page = require("../models/Page");
const facebookConfig = require("../config/facebook");
const usedCodes = new Set();

// Get Facebook auth URL
exports.getFacebookAuthUrl = async (req, res) => {
  try {
    const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/callback`;

    const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${
      facebookConfig.appId
    }&redirect_uri=${redirectUri}&state=${
      req.user.id
    }&scope=${facebookConfig.required_permissions.join(",")}`;

    console.log("Generated Facebook auth URL:", url);
    res.json({ url });
  } catch (error) {
    console.error("Get Facebook auth URL error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.handleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) {
      console.error("Missing code in callback");
      return res.redirect("/?error=missing_code");
    }
    // Check if code has been used
    if (usedCodes.has(code)) {
      console.error("Code has already been used:", code);
      return res.redirect("/?error=code_reused");
    }
    // Mark code as used
    usedCodes.add(code);
    const userId = state;
    const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/callback`;
    try {
      // Exchange code for access token
      const tokenResponse = await axios.get(
        `${facebookConfig.graphApiBaseUrl}/oauth/access_token`,
        {
          params: {
            client_id: facebookConfig.appId,
            redirect_uri: redirectUri,
            client_secret: facebookConfig.appSecret,
            code: code,
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;
      console.log("Received access token:", accessToken);

      // Get user profile
      const userResponse = await axios.get(
        `${facebookConfig.graphApiBaseUrl}/me`,
        {
          params: { access_token: accessToken },
        }
      );
      console.log("Received user profile:", userResponse.data);

      // Save Facebook user data
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found:", userId);
        return res.redirect("/?error=user_not_found");
      }
      user.facebookUserId = userResponse.data.id;
      user.facebookAccessToken = accessToken;
      // Default expiry to 60 days if not provided
      user.tokenExpiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      await user.save();
      console.log("Saved user data:", user);

      // Get user's pages
      const pagesResponse = await axios.get(
        `${facebookConfig.graphApiBaseUrl}/me/accounts`,
        {
          params: { access_token: accessToken },
        }
      );
      console.log("Received user pages:", pagesResponse.data);

      // Save pages
      const pages = pagesResponse.data.data || [];
      for (const page of pages) {
        let existingPage = await Page.findOne({
          userId: userId,
          pageId: page.id,
        });
        if (existingPage) {
          existingPage.pageAccessToken = page.access_token;
          existingPage.connected = true;
          await existingPage.save();
          console.log("Updated existing page:", existingPage);
        } else {
          const newPage = await Page.create({
            userId,
            pageId: page.id,
            pageName: page.name,
            pageAccessToken: page.access_token,
          });
          console.log("Created new page:", newPage);
        }
        // Subscribe to webhooks
        try {
          await axios.post(
            `${facebookConfig.graphApiBaseUrl}/${page.id}/subscribed_apps`,
            {},
            {
              params: {
                access_token: page.access_token,
                subscribed_fields: "messages, messaging_postbacks",
              },
            }
          );
          console.log(`Subscribed to webhooks for page ${page.id}`);
        } catch (webhookError) {
          console.error(
            `Error subscribing to webhooks for page ${page.id}:`,
            webhookError.message
          );
        }
      }
      res.redirect("/");
    } catch (apiError) {
      console.error("Facebook API error:", apiError.message);
      // Check for invalid code error
      if (
        apiError.response?.headers?.["www-authenticate"]?.includes(
          "invalid_code"
        )
      ) {
        return res.redirect("/?error=invalid_code");
      }
      return res.redirect(`/?error=${encodeURIComponent(apiError.message)}`);
    }
  } catch (error) {
    console.error("Facebook callback error:", error);
    res.redirect("/?error=server_error");
  }
};
