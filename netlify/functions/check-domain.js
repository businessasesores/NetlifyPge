const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtienes tu API Key de un archivo de configuración
  const allowedOrigin = 'https://businessasesores.web.app'; // Tu dominio permitido
  const origin = event.headers.origin;

  // Manejo de CORS
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
    // Hacemos la solicitud a la API de apilayer para consultar el dominio
    const response = await axios.get(`https://api.apilayer.com/whois/check?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Retornamos la respuesta con la información
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    // Si el dominio no se encuentra o hay un error
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error en la consulta de Whois. El dominio no fue encontrado o hubo un problema.' }),
    };
  }
};
