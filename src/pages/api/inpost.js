export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // Extract the shipment ID from the query parameters
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ message: 'Shipment ID is required' });
    }
  
    try {
      // Your InPost API token (should be stored securely in environment variables)
      const token = process.env.INPOST_API_TOKEN || 'your_default_token_here';
  
      const response = await fetch(`https://api-shipx-pl.easypack24.net/v1/shipments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching shipment details:', error);
      res.status(500).json({ 
        message: error.message || 'Error fetching shipment details' 
      });
    }
  }