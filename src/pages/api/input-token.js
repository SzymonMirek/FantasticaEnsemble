// routes/api/inpost-token.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const INPOST_CLIENT_ID = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTk5MzI4MjEsImlhdCI6MTc0NDU3MjgyMSwianRpIjoiMmNjYzFiZmYtMDFhYy00YjNmLWI0ODMtN2Y1ODc3MWIxZTQwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTo1YWN5QkJFN2gwdWxWZV9xQWFPeVJPYzk5d3JPTlV6UU5fWEtrbkJQYmU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYjQwYzFjZDktNzhhZi00YWFmLTljZGEtM2MyMTI5NDA1OTZjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiJiNDBjMWNkOS03OGFmLTRhYWYtOWNkYS0zYzIxMjk0MDU5NmMiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI4ZDM2OGQzYS04MGU0LTRiNGEtOGMwZi01MjhhZTcxYTAzZjMiLCJlbWFpbCI6Im93Y3pld29yeUBnbWFpbC5jb20ifQ.e6uTAA6GxNi9z2Q4mUdE_2oRSsvEvDanvpS559UNrVxlaswC0mKtq6xGYxnjtEqE0nBNf5kap7m8OFEckqqu3ZxlF1R330G4VALF5ylpMdp6oMSRe_Q95xdwBbo9NLcisPBetXT5pgEcisXkxStklMMdTITLGYxPmBsQ9sM1zEqP7BsSNXZcE0QUNZ0tWkS3pob8k8Fbi3-rsIXYka5S3Oyd85fxVjmXzbFXkHGjkI4WbQNaEVVHmFQeCwZBQKE3cGqJgoNwXNhWIkaeXCqBIAjPO37_fl37sqZI-';
// const INPOST_CLIENT_SECRET = 'your-client-secret';

let tokenCache = null;
let tokenExpiry = null;

router.post('/', async (req, res) => {
  try {
    // Return cached token if valid
    if (tokenCache && tokenExpiry > Date.now()) {
      return res.json({ token: tokenCache });
    }
    
    // Get new token
    const response = await axios.post('https://api.inpost.pl/v1/auth', {
      grant_type: 'client_credentials',
      client_id: INPOST_CLIENT_ID,
    //   client_secret: INPOST_CLIENT_SECRET
    });
    
    tokenCache = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    res.json({ token: tokenCache });
  } catch (error) {
    console.error('InPost auth error:', error);
    res.status(500).json({ error: 'Failed to get InPost token' });
  }
});

module.exports = router;