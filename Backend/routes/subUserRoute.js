const express = require("express");
const {
  createSubUser,
  loginSubUser,
  logoutSubUser,
} = require("../controllers/subUserController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Define routes for sub-user registration, login, and logout
router.post("/register-subuser", authMiddleware, createSubUser);
router.post("/login-subuser", loginSubUser);
router.get("/logout-subuser", authMiddleware, logoutSubUser);

module.exports = router;

// In the subUserRoute.js file, we have defined the routes for registering, logging in, and logging out sub-users.
// We have imported the subUserController.js file, which contains the controller functions for these routes.
// We have also imported the authMiddleware.js file, which is used to authenticate the sub-user before accessing protected routes.
// We have defined the routes using the express.Router() method and exported the router object.
