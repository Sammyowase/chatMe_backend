import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check for token in cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Unauthorized - Token Expired" });
        }
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
      }
      return decoded;
    });

    // If the token is invalid or expired, the error response is sent in jwt.verify
    if (!decoded) {
      return;
    }

    // Check if the user exists based on the decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user data to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("Error in protectRoute middleware:", error);

    // Handle general errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};
