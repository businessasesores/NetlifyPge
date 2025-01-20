const axios = require('axios');

exports.handler = async (event) => {
  console.log('Objeto de evento:', JSON.stringify(event, null, 2)); // Reference: Inspects the event object

  try {
    // Verifications and logic of your function (Reference: Checks for missing event properties)
    if (!event || !event.request || !event.request.headers) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Solicitud inválida: Falta información en el evento' })
      };
    }

    const origin = event.request.headers.get('Origin');
    const allowedOrigin = 'https://buscador.hostweb.workers.dev';

    // Check origin and return error if not allowed (Reference: Checks for allowed origin)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
      };
    }

    // Extract domain from query parameters (Reference: Extracts domain from query string)
    const domain = event.queryStringParameters.domain;

    try {
      const apiKey = process.env.API_KEY; // Ensure API key is set as an environment variable

      // Make the request to the Whois API using Axios (Reference: Makes the Whois API request)
      const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
        headers: {
          'apikey': apiKey
        }
      });

      // Handle successful response (Reference: Handles successful response with CORS)
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
  } catch (error) {
    // Handle any other errors that might occur in your function
    console.error('Error inesperado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};