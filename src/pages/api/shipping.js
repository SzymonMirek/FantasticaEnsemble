import fetch from "node-fetch";

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const snipcartOrder = req.body;

  // 1. Get custom field (locker)
  const lockerField = snipcartOrder.customFields.find(
    (field) => field.name === "Punkt odbioru InPost"
  );

  const lockerName = lockerField?.value || "Brak";

  // 2. Extract locker code (e.g. from "KRA01M – ul. Testowa 12")
  const lockerCode = lockerName.split(" – ")[0];

  // 3. Prepare shipment payload for InPost
  const shipmentData = {
    receiver: {
      email: snipcartOrder.email,
      phone: snipcartOrder.shippingAddress.phone, // or use billingAddress
    },
    target_point: lockerCode,
    service: "inpost_locker_standard",
    parcels: [{ dimensions: "small" }], // or "medium" / "large"
    reference: `Snipcart Order ${snipcartOrder.token}`,
  };

  // 4. Send request to InPost ShipX
  try {
    const response = await fetch("https://api-shipx-pl.easypack24.net/v1/shipments", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_INPOST_API_TOKEN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("InPost API error:", result);
      return res.status(500).json({ error: "Failed to create shipment" });
    }

    // Optional: save result to your DB or log
    return res.status(200).json({ success: true, shipment: result });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
};
