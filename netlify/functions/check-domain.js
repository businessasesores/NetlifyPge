const axios = require('axios');

exports.handler = async (event) => {
  console.log('Objeto de evento:', JSON.stringify(event, null, 2));

  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Formato de evento inválido' })
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