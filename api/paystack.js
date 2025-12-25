import { db } from "../firebase/admin.js";

export default async function handler(req, res) {
  // ===== CORS headers =====
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== Your Paystack logic =====
  if (req.method === "POST") {
    try {
      const { userId, spAmount } = req.body;
      // Call Paystack or your logic here

      res.status(200).json({ status: "success", spAdded: spAmount });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    res.status(405).json({ status: "error", message: "Method not allowed" });
  }
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
