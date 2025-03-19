const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SubUser = require("../models/SubUser");
const config = require("../config/config");

// **Create Sub User**
const createSubUser = async (req, res) => {
  try {
    if (req.user.userType !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden. Only main users can create sub-users." });
    }
    const { username, password } = req.body;

    const subUser = new SubUser({
      mainUserId: req.user.id,
      username,
      password,
    });
    await subUser.save();

    const user = await User.findByIdAndUpdate(req.user.id, {
      $push: { subUsers: subUser._id },
    });

    await user.save();

    res.status(201).json({ message: "Sub user created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating sub user", error: error.message });
  }
};

// **Login Sub User**
const loginSubUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const subUser = await SubUser.findOne({ username });
    if (!subUser) return res.status(400).json({ message: "SubUser not found" });

    // Compare hashed password
    const isMatch = await subUser.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: subUser._id, userType: "SubUser" },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "SubUser login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// **Logout Sub User**
const logoutSubUser = async (req, res) => {
  res
    .clearCookie("token", { httpOnly: true })
    .json({ message: "Logged out successfully" });
};

module.exports = {
  createSubUser,
  loginSubUser,
  logoutSubUser,
};
