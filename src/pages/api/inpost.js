export async function post({ request }) {
    // Get data from frontend
    const { postalCode, weight } = await request.json();
    
    // Securely get your token from environment variables
    const token = import.meta.env.INPOST_API_TOKEN;
    
    // Call InPost API server-side
    const response = await fetch(`https://api-shipx-it.easypack24.net/v1/points?relative_post_code=${postalCode}&max_distance=2000`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch InPost points' }), {
        status: 500
      });
    }
    
    const data = await response.json();
    
    // Format response for Snipcart
    const rates = data.items.map(point => ({
      cost: calculateCost(weight, point),
      description: `InPost ${point.type.includes('apm') ? 'Locker' : 'PUP'} - ${point.address.line1}`,
      userDefinedId: `inpost_${point.name}`
    }));
    
    return new Response(JSON.stringify({ rates }));
  }
  
  function calculateCost(weight, point) {
    // Your pricing logic here
    return weight < 1000 ? 9.99 : 12.99;
  }
  async function getShippingOptions(postalCode, weight) {
    try {
      const response = await fetch('/api/inpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postalCode, weight })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching shipping options:', error);
      return { rates: [], error: error.message };
    }
  }
  
  // Usage example
  const shippingOptions = await getShippingOptions('00100', 500);