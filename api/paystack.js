import { db } from "../firebase/admin.js";

export default async function handler(req, res) {

  // Allow requests from ANY origin (for testing)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { userId, spAmount } = req.body;

    if (!userId || !spAmount) {
      return res.status(400).json({ error: "Missing userId or spAmount" });
    }

    const userRef = db.ref(`users/${userId}/points`);

    const snapshot = await userRef.get();
    const currentSP = snapshot.exists() ? snapshot.val() : 0;

    const newSP = currentSP + Number(spAmount);

    await userRef.set(newSP);

    return res.json({
      success: true,
      userId,
      newSP,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
