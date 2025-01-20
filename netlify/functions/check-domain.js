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

    const domain = event.queryStringParameters.domain;

    try {
  const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
    headers: {
      'apikey': apiKey
    },
    timeout: 5000 // Agregar un timeout para evitar que la solicitud se bloquee
  });

  // Manejar la respuesta de la API
  if (response.status === 200) {
    // Procesar los datos de la respuesta
  } else {
    console.error('Error en la API de Whois:', response.data);
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
    };
  }
} catch (error) {
  console.error('Error al realizar la solicitud:', error);
  if (error.code === 'ECONNABORTED') {
    return {
      statusCode: 504,
      body: JSON.stringify({ error: 'Tiempo de espera agotado' })
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
}