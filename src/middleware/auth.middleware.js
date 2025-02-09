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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is invalid or expired
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid or Expired Token" });
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

    // Handle JWT errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Handle any other server errors
    res.status(500).json({ message: "Internal server error" });
  }
};
