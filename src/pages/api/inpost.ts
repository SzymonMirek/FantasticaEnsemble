// src/pages/api/inpost.ts
export async function post({ request }: { request: Request }) {
    const body = await request.json();
    const order = body.content;
  
    const lockerName = order.items[0]?.customFields?.find(
      (field) => field.name === "Punkt odbioru InPost"
    )?.value;
  
    const shippingData = {
      receiver: {
        email: order.email,
        phone: order.shippingAddress.phone,
        name: `${order.shippingAddress.name}`,
      },
      parcel: {
        target_point: lockerName,
        size: "A", // change if needed
      },
      custom_attributes: {
        reference: order.invoiceNumber,
      },
    };
  
    const response = await fetch("https://api-shipx-pl.easypack24.net/v1/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer api-key`,
      },
      body: JSON.stringify(shippingData),
    });
  
    const result = await response.json();
  
    console.log("InPost Shipment Created:", result);
  
    return new Response(JSON.stringify({ success: true, inpost: result }), {
      status: 200,
    });
  }
  