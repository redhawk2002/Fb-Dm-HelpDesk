// Import required modules
const express = require("express");
const config = require("./config/config");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const subUserRoute = require("./routes/subUserRoute");
const facebookRoute = require("./routes/facebookRoute");
const webhookRoutes = require("./routes/webhookRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
// Initialize express app and connect to the database
const app = express();
const port = config.port;
connectDB();
const allowedOrigin = "http://localhost:5173";
// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

app.use("/api/v1", userRoute);
app.use("/api/v1", subUserRoute);
app.use("/api/v1", facebookRoute);
app.use("/api/v1/webhook", webhookRoutes);
app.use("/api/v1", conversationRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Facebook API server");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Press CTRL + C to stop the server`);
});
