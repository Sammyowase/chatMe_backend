import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js"; // io not needed here

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const CLIENT_URL = "https://chatmeapp.vercel.app";

// Middleware - Increase payload size limit before setting up CORS
app.use(express.json({ limit: '10mb' }));  // Increased payload limit
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: CLIENT_URL, 
    credentials: true, 
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath)); 

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start Server
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server is running on PORT: ${PORT}`);
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
});
