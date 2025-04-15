// Add this to your main JavaScript file
document.addEventListener('snipcart.ready', function() {
    Snipcart.execute('registerShipping', function(shipping) {
      if (document.getElementById('delivery-method').value === 'inpost') {
        return {
          method: 'InPost Paczkomat',
          cost: 8.99, // Set your price
          customFields: [
            {
              name: 'inpost-locker',
              type: 'select',
              options: [],
              required: true,
              placeholder: 'Select locker location'
            }
          ]
        };
      } else {
        return {
          method: 'Standard Delivery',
          cost: 12.99
        };
      }
    });
  });

  async function fetchInPostLockers(postalCode) {
    try {
      // First get token (you should cache this server-side)
      const authResponse = await fetch('https://your-server.com/api/inpost-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { token } = await authResponse.json();
      
      // Then get lockers
      const response = await fetch(`https://api.inpost.pl/v1/points?post_code=${postalCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const lockers = await response.json();
      return lockers.items.map(locker => ({
        value: locker.name,
        label: `${locker.name} - ${locker.address.line1}, ${locker.address.line2}`
      }));
      
    } catch (error) {
      console.error('Error fetching InPost lockers:', error);
      return [];
    }
  }
  
  // Update shipping method when address changes
  Snipcart.subscribe('shipping.address.change', async function(address) {
    if (address.postalCode && document.getElementById('delivery-method').value === 'inpost') {
      const lockers = await fetchInPostLockers(address.postalCode);
      Snipcart.api.session.updateShippingMethod({
        method: 'InPost Paczkomat',
        cost: 8.99,
        customFields: [{
          name: 'inpost-locker',
          type: 'select',
          options: lockers,
          required: true
        }]
      });
    }
  });