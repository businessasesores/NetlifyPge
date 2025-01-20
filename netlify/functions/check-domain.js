const axios = require('axios');

exports.handler = async (event) => {
  try {
    const domain = event.queryStringParameters.domain;
    const apiKey = process.env.API_KEY;
    const origin = event.request?.headers?.get('Origin');
    const allowedOrigin = 'https://buscador.hostweb.workers.dev';

    // CORS validation (optional, assuming CORS is configured on Netlify)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' }),
      };
    }

    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
      timeout: 5000,
    });

    if (response.status === 200) {
      // Process successful response (check for "registered" result as before)
      // ...
    } else {
      console.error('API Layer error:', response.data);
      return {
        statusCode: response.status, // Return the specific status code
        body: JSON.stringify({ error: 'Error en la API de Whois', details: response.data }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle other potential errors (network, code, etc.)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};