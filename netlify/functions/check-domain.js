const axios = require('axios'); // Import axios at the module level

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2));

  // Verify event object and its properties
  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' })
    };
  }

  const origin = event.request.headers.get('Origin');
  const allowedOrigin = 'https://buscador.hostweb.workers.dev';

  // Check origin and return error if not allowed
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
    };
  }

  // Extract domain from query parameters
  const domain = event.queryStringParameters.domain;

  try {
    const apiKey = process.env.API_KEY; // Ensure API key is set as an environment variable

    // Make the request to the Whois API using Axios
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

    // Handle successful response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin // Allow CORS
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error al verificar el dominio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio: ' + error.message })
    };
  }
};