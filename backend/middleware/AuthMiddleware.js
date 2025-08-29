// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // token usually comes as "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultSecret"
    );
    req.user = decoded; // store user info in request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
