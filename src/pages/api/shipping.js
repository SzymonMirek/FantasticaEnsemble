// In your Astro API route (e.g., /src/pages/api/shipping.js)
export async function post({ request }) {
    const snipcartRequest = await request.json();
    
    // Extract necessary information from Snipcart request
    const { shippingAddressPostalCode, items, totalWeight } = snipcartRequest.content;
    
    // Call InPost API to get shipping rates
    const inpostRates = await getInPostRates(
      shippingAddressPostalCode,
      totalWeight
    );
    
    // Format response for Snipcart
    return new Response(JSON.stringify({
      rates: inpostRates
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  async function getInPostRates(postalCode, weight) {
    try {
      // You may need to get an access token first
      // See: https://github.com/imper86/php-inpost-api for reference :cite[3]
      
      const response = await fetch('https://api-shipx-it.easypack24.net/v1/points', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
           'Authorization': `Bearer ${eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTk5MzI4MjEsImlhdCI6MTc0NDU3MjgyMSwianRpIjoiMmNjYzFiZmYtMDFhYy00YjNmLWI0ODMtN2Y1ODc3MWIxZTQwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTo1YWN5QkJFN2gwdWxWZV9xQWFPeVJPYzk5d3JPTlV6UU5fWEtrbkJQYmU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYjQwYzFjZDktNzhhZi00YWFmLTljZGEtM2MyMTI5NDA1OTZjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiJiNDBjMWNkOS03OGFmLTRhYWYtOWNkYS0zYzIxMjk0MDU5NmMiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI4ZDM2OGQzYS04MGU0LTRiNGEtOGMwZi01MjhhZTcxYTAzZjMiLCJlbWFpbCI6Im93Y3pld29yeUBnbWFpbC5jb20ifQ.e6uTAA6GxNi9z2Q4mUdE_2oRSsvEvDanvpS559UNrVxlaswC0mKtq6xGYxnjtEqE0nBNf5kap7m8OFEckqqu3ZxlF1R330G4VALF5ylpMdp6oMSRe_Q95xdwBbo9NLcisPBetXT5pgEcisXkxStklMMdTITLGYxPmBsQ9sM1zEqP7BsSNXZcE0QUNZ0tWkS3pob8k8Fbi3-rsIXYka5S3Oyd85fxVjmXzbFXkHGjkI4WbQNaEVVHmFQeCwZBQKE3cGqJgoNwXNhWIkaeXCqBIAjPO37_fl37sqZI-}` if required
        }
      });
      
      const data = await response.json();
      
      // Process the InPost response and format shipping options
      return data.items.map(point => ({
        cost: calculateCostBasedOnWeight(weight), // Implement your pricing logic
        description: `InPost ${point.type.includes('apm') ? 'Locker' : 'PUDO Point'} - ${point.address.line1}`,
        userDefinedId: `inpost_${point.name}`,
        guaranteedDaysToDelivery: estimateDeliveryDays(point) // Implement your logic
      }));
    } catch (error) {
      console.error('Error fetching InPost rates:', error);
      return [];
    }
  }