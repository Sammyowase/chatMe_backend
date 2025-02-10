import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it in the response cookies.
 * 
 * @param {string} userId - The ID of the user for which the token is generated.
 * @param {object} res - The Express response object to send the cookie.
 * @returns {string} - The generated JWT token.
 */
export const generateToken = (userId, res) => {
  // Generate JWT token with userId as payload and an expiration of 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  // Set the token in a cookie with security settings
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days)
    httpOnly: true, // Prevents access to cookie via JavaScript (prevents XSS attacks)
    sameSite: "strict", // Restricts cookie to same-site requests (prevents CSRF attacks)
    secure: process.env.NODE_ENV !== "development", // Use HTTPS in production, HTTP in development
  });

  return token;
};
