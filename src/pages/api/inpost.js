export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({
        message: `Method ${req.method} not allowed`,
        allowedMethods: ['GET']
      });
    }
  
    // Extract the shipment ID from the query parameters
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ 
        message: 'Shipment ID is required',
        example: '/api/inpost?id=XYZ123'
      });
    }
  
    try {
      const token = process.env.INPOST_API_TOKEN;
      if (!token) {
        return res.status(401).json({
          message: 'API token not configured',
          solution: 'Set INPOST_API_TOKEN in your environment variables'
        });
      }
  
      const apiResponse = await fetch(`https://api-shipx-pl.easypack24.net/v1/shipments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        return res.status(apiResponse.status).json({
          message: 'InPost API error',
          status: apiResponse.status,
          error: errorData
        });
      }
  
      const data = await apiResponse.json();
      
      // Set proper headers before sending response
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(data);
      
    } catch (error) {
      console.error('InPost API failure:', error);
      res.status(500).json({
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }