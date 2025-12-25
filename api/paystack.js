import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, spAmount } = req.body;

    if (!userId || !spAmount) {
      return res.status(400).json({ error: "Missing data" });
    }

    await admin
      .database()
      .ref(`users/${userId}/sp`)
      .transaction((current = 0) => current + spAmount);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
