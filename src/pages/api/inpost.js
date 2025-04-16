// netlify/functions/create-shipment.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const response = await fetch('https://api.inpost.pl/shipx/v1/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNTk5MzI4MjEsImlhdCI6MTc0NDU3MjgyMSwianRpIjoiMmNjYzFiZmYtMDFhYy00YjNmLWI0ODMtN2Y1ODc3MWIxZTQwIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTo1YWN5QkJFN2gwdWxWZV9xQWFPeVJPYzk5d3JPTlV6UU5fWEtrbkJQYmU4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiYjQwYzFjZDktNzhhZi00YWFmLTljZGEtM2MyMTI5NDA1OTZjIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyBhcGk6c2hpcHgiLCJzaWQiOiJiNDBjMWNkOS03OGFmLTRhYWYtOWNkYS0zYzIxMjk0MDU5NmMiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI4ZDM2OGQzYS04MGU0LTRiNGEtOGMwZi01MjhhZTcxYTAzZjMiLCJlbWFpbCI6Im93Y3pld29yeUBnbWFpbC5jb20ifQ.e6uTAA6GxNi9z2Q4mUdE_2oRSsvEvDanvpS559UNrVxlaswC0mKtq6xGYxnjtEqE0nBNf5kap7m8OFEckqqu3ZxlF1R330G4VALF5ylpMdp6oMSRe_Q95xdwBbo9NLcisPBetXT5pgEcisXkxStklMMdTITLGYxPmBsQ9sM1zEqP7BsSNXZcE0QUNZ0tWkS3pob8k8Fbi3-rsIXYka5S3Oyd85fxVjmXzbFXkHGjkI4WbQNaEVVHmFQeCwZBQKE3cGqJgoNwXNhWIkaeXCqBIAjPO37_fl37sqZI-J74yP0PgOcFHOMogb3wNqeo_rwOJss9a5xhhTb9--UtQhVjxw'
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
