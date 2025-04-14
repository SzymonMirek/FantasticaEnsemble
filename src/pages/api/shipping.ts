import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const country = body.shippingAddress?.country;

  // Optional: fetch InPost locker points here based on country/postcode
  const inPostRate = {
    cost: 1000, // in cents (e.g., 10.00 PLN)
    description: "InPost Locker Delivery",
    guaranteed_days_to_delivery: 2,
    id: "inpost-locker",
  };

  return new Response(JSON.stringify([inPostRate]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
