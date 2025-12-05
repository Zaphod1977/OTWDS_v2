// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // keep for future if we ever need it

// Helper: normalize email + split env arrays safely
const getEmailsArray = (envVar) =>
  process.env[envVar]
    ? process.env[envVar].split(",").map((e) => e.trim().toLowerCase())
    : [];

// These two arrays are the ONLY people who will EVER be allowed in
const SUPREMELORD_EMAILS = getEmailsArray("SUPREMELORD_EMAILS");
const ADMIN_EMAILS = getEmailsArray("ADMIN_EMAILS");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email.toLowerCase();

    // SUPREMELORD → god mode
    if (SUPREMELORD_EMAILS.includes(userEmail)) {
      req.user = {
        email: decoded.email,
        role: "supremelord",           // we’ll use this string later
        isSupremelord: true,
        isAdmin: true,
      };
      return next();
    }

    // Hard-coded Admins → full admin rights (but not supremelord)
    if (ADMIN_EMAILS.includes(userEmail)) {
      req.user = {
        email: decoded.email,
        role: "admin",
        isSupremelord: false,
        isAdmin: true,
      };
      return next();
    }

    // Everyone else → GTFO
    return res.status(403).json({ message: "Access denied. Invalid credentials." });
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = { auth };