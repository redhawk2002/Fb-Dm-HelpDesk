const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Define routes for user registration, login, logout, and getting user information
router.post("/register", register);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);
router.get("/user", authMiddleware, getUser);

module.exports = router;

// In the userRoute.js file, we have defined the routes for registering, logging in, logging out, and getting user information.
// We have imported the userController.js file, which contains the controller functions for these routes.
// We have also imported the authMiddleware.js file, which is used to authenticate the user before accessing protected routes.
// We have defined the routes using the express.Router() method and exported the router object.
