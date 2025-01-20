const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2)); 

  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' })
    };
  }

  const origin = event.headers.get('Origin'); 
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; 
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
    };
  }

  // Extraer el dominio de los parámetros de la cadena de consulta
  const domain = event.queryStringParameters.domain;

  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin
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