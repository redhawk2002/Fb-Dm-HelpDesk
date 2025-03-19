const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getFacebookAuthUrl,
  handleCallback,
} = require("../controllers/facebookController");

const router = express.Router();

// Define your routes here
router.get("/getFacebookAuthUrl", authMiddleware, getFacebookAuthUrl);
router.get("/callback", handleCallback);
module.exports = router;
