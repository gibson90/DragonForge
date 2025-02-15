const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  let authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  let token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Token is valid, continue
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ msg: "Token expired", tokenExpired: true });
    } else {
      return res.status(403).json({ msg: "Invalid or expired token." });
    }
  }
};
