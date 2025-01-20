const axios = require('axios');

exports.handler = async (event) => {
  console.log('Objeto de evento:', JSON.stringify(event, null, 2));

  try {
    // Verificaciones y lógica de tu función
    if (!event || !event.queryStringParameters || !event.queryStringParameters.domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Solicitud inválida: Falta el parámetro "domain".' })
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
      // Log more specific error details here
      console.error('Error details:', error.response?.data || error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al verificar el dominio' })
      };
    }
  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};