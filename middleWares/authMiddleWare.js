// Example middleware (authMiddleware.js)
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader) {
    console.error("Authorization header is missing");
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error("Token is missing in the Authorization header");
    return res.status(401).json({ error: "Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "5ecr3tAbG", (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token", details: err.message });
    }

    req.user = user;
    console.log("myUser:", user)
    next();
  });
};
