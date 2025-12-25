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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end(); // preflight

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, spAmount } = req.body;

    if (!userId || !spAmount)
      return res.status(400).json({ error: "Missing parameters" });

    const userRef = db.ref(`users/${userId}/points`);
    const snapshot = await userRef.get();
    const currentSP = snapshot.exists() ? snapshot.val() : 0;
    const newSP = currentSP + Number(spAmount);

    await userRef.set(newSP);

    return res.status(200).json({
      success: true,
      userId,
      newSP
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
