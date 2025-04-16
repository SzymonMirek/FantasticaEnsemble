import axios from 'axios';

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

    const response = await axios.get(`https://api-shipx-pl.easypack24.net/v1/shipments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Forward the response from InPost API to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching shipment details:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({
        message: error.response.data.message || 'Error fetching shipment details',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ message: 'No response received from InPost API' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ message: error.message });
    }
  }
}