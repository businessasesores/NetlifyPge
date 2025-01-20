const axios = require('axios');

exports.handler = async (event) => {
  // Log the event object for debugging
  console.log('Event object:', JSON.stringify(event, null, 2));

  // Verify the origin of the request (restrict access to allowed origin)
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; // Replace with your allowed origin
  const origin = event.headers.get('Origin');
  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' }),
    };
  }
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
    };
  }

  // Optional authentication (add if needed)
  // ... (code for authentication is commented out)

  // Extract the domain from the query string parameters
  const domain = event.queryStringParameters.domain;

  // Optional domain validation (add logic here if needed)

  // Make the request to the Whois API using Axios
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error verifying domain' }),
    };
  }
};