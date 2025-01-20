const axios = require('axios');

exports.handler = async (event) => {
  // Check if the event object is defined
  if (!event) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing event object' })
    };
  }

  // Access headers from the request object
  const origin = event.request.headers.get('Origin');
  const allowedOrigin = 'https://buscador.hostweb.workers.dev';

  // ... rest of your code using origin and other event properties
};
  // Extraer el dominio de los parámetros de la cadena de consulta
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