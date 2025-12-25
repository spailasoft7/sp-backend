// File: api/paystack.js (Vercel)
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// ===== Firebase Admin config =====
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://mr7s-ec4c3-default-rtdb.firebaseio.com"
});

const db = getDatabase();

export default async function handler(req, res) {
  // ===== CORS headers =====
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== Your existing Paystack / Firebase logic =====
  try {
    const { userId, spAmount } = req.body;
    const admin = require("./admin.js").default; // make sure this points to your admin.js
    const db = admin.database();

    const userRef = db.ref(`users/${userId}/points`);
    const snapshot = await userRef.get();
    const currentSP = snapshot.exists() ? snapshot.val() : 0;
    const newSP = currentSP + Number(spAmount);
    await userRef.set(newSP);

    return res.status(200).json({ success: true, newSP, userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
