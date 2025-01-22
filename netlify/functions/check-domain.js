const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY;
  const allowedOrigin = 'https://businessasesores.web.app'; // Tu dominio permitido
  const origin = event.headers.origin;

  // Validar el origen de la solicitud
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // Permite solicitudes desde tu frontend
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({ error: 'Error al consultar el dominio.' }),
    };
  }
};
