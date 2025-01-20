const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtain API key from environment variable

  // CORS validation (assuming CORS is configured on Netlify)
  const origin = event.request?.headers?.get('Origin');
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; // Replace with your allowed origin

  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' }),
    };
  }

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000 // Set a timeout for the API request
    });

    // Check for successful response and valid data
    if (response.status === 200 && response.data) {
      const whoisData = response.data;

      // Adjust the logic based on the API response structure
      // (refer to the API documentation for specific property names)
      if (whoisData.status === 'registered') {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está registrado' })
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está disponible' })
        };
      }
    } else {
      console.error('Error in Whois API response:', response.statusText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois' })
      };
    }
  } catch (error) {
    console.error('Error during request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
