export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const event = req.body;

  // Just test for now
  console.log("Paystack event:", event);

  return res.status(200).json({ received: true });
}
