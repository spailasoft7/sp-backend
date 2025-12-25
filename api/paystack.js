import { db } from "../firebase/admin.js";

export default async function handler(req, res) {
  // ===== CORS headers =====
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ===== Handle preflight OPTIONS =====
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { userId, spAmount } = req.body;

      // ===== Firebase SP logic =====
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
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
