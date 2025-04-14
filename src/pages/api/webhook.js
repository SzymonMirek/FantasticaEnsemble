export const post = async ({ request }) => {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
  
    const data = await request.json(); // Parse JSON payload
    console.log("Webhook received:", data);
  
    // Process the data (e.g., save to DB, trigger an action)
    return new Response("Webhook received!", { status: 200 });
  };