// Handle Snipcart webhook for completed orders
app.post('/api/snipcart-webhook', async (req, res) => {
    const order = req.body;
    
    if (order.shippingMethod === 'InPost Paczkomat') {
      const lockerId = order.customFields.find(f => f.name === 'inpost-locker').value;
      
      // Create InPost shipment
      const shipmentResponse = await axios.post(
        'https://api.inpost.pl/v1/organizations/{your-org-id}/shipments',
        {
          receiver: {
            email: order.email,
            phone: order.phone || '',
          },
          parcels: {
            dimensions: {
              length: 20,
              width: 15,
              height: 10,
              weight: 1
            }
          },
          target_point: lockerId,
          insurance: {
            amount: order.total,
            currency: order.currency
          },
          service: 'inpost_locker_standard',
          reference: order.invoiceNumber
        },
        {
          headers: {
            'Authorization': `Bearer ${await getInPostToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Save shipment ID to your database
      await saveShipmentDetails(order.token, shipmentResponse.data);
    }
    
    res.status(200).send('OK');
  });