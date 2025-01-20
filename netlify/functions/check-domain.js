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

       if (response.status === 200) {
    // Procesar los datos de la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } else {
    // Manejar errores de la API
    console.error('Error en la API de Whois:', response.data);
    return {
      statusCode: response.status, // Devuelve el código de estado de la API
      body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
    };
  }
} catch (error) {
  console.error('Error inesperado:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Error interno del servidor', details: error.message })
  };
};
};