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
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTk5MzI4MjEsImlhdCI6MTc0NDU3MjgyMSwianRpIjoiMmNjYzFiZmYtMDFhYy00YjNmLWI0ODMtN2Y1ODc3MWIxZTQwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTo1YWN5QkJFN2gwdWxWZV9xQWFPeVJPYzk5d3JPTlV6UU5fWEtrbkJQYmU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYjQwYzFjZDktNzhhZi00YWFmLTljZGEtM2MyMTI5NDA1OTZjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiJiNDBjMWNkOS03OGFmLTRhYWYtOWNkYS0zYzIxMjk0MDU5NmMiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI4ZDM2OGQzYS04MGU0LTRiNGEtOGMwZi01MjhhZTcxYTAzZjMiLCJlbWFpbCI6Im93Y3pld29yeUBnbWFpbC5jb20ifQ.e6uTAA6GxNi9z2Q4mUdE_2oRSsvEvDanvpS559UNrVxlaswC0mKtq6xGYxnjtEqE0nBNf5kap7m8OFEckqqu3ZxlF1R330G4VALF5ylpMdp6oMSRe_Q95xdwBbo9NLcisPBetXT5pgEcisXkxStklMMdTITLGYxPmBsQ9sM1zEqP7BsSNXZcE0QUNZ0tWkS3pob8k8Fbi3-rsIXYka5S3Oyd85fxVjmXzbFXkHGjkI4WbQNaEVVHmFQeCwZBQKE3cGqJgoNwXNhWIkaeXCqBIAjPO37_fl37sqZI-`,
      },
      body: JSON.stringify(shippingData),
    });
  
    const result = await response.json();
  
    console.log("InPost Shipment Created:", result);
  
    return new Response(JSON.stringify({ success: true, inpost: result }), {
      status: 200,
    });
  }
  