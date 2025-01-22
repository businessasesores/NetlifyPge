const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; 
  const allowedOrigin = 'https://businessasesores.web.app';
  const origin = event.headers.origin;

  // Manejo de CORS para solicitudes válidas
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  try {
    // Llamada a la API de WHOIS
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Retornar datos de la API con encabezados CORS
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // Manejo de errores para dominios no registrados
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ result: 'available' }),
      };
    }

    // Errores generales
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Error en el servidor o en la consulta.' }),
    };
  }
};
