import { db } from "../firebase/admin.js";

export default async function handler(req, res) {
  // Allow all origins (for testing)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // preflight request
    return res.status(200).end();
  }

  // Your existing Paystack logic here
  try {
    const { userId, spAmount } = req.body;
    
    // Simulate success (replace with real Paystack call)
    res.status(200).json({ status: "success", spAdded: spAmount });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}  try {
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
