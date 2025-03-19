const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SubUser = require("../models/SubUser");
const config = require("../config/config");

// **Register User**
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Log the incoming request body for debugging
    console.log("Register request body:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// **Login User**
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, userType: "Admin" },
      config.jwtSecret,
      {
        expiresIn: "1h",
      }
    );
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// **Logout User**
const logout = (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, expires: new Date(0) })
    .json({ message: "Logged out successfully" });
};

// **Get User Info (Protected)**
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUser,
};
