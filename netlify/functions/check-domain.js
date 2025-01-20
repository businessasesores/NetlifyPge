const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2)); 

  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' })
    };
  }

  const origin = event.request.headers.get('Origin'); 
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; 
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
    };
  }

  // Resto de tu código... 
}; 
  const dominio = event.queryStringParameters.domain;

  // Realizar la solicitud a la API de Whois usando Axios
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });

    // Analizar la respuesta de la API para determinar la disponibilidad
    const estaDisponible = !response.data.available;

    return {
      statusCode: 200,
      body: JSON.stringify({ disponible: estaDisponible })
    };
  } catch (error) {
    console.error('Error al verificar el dominio:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio: ' + error.message })
    };
  };