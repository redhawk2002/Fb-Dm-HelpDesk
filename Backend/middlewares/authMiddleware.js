const jwt = require("jsonwebtoken");
const config = require("../config/config");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    // Verify the token using the secret key and decode the payload
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
