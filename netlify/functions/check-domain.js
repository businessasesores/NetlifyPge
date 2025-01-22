const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain; // Dominio a verificar
  const apiKey = process.env.API_KEY; // Variable de entorno en Netlify
  const allowedOrigin = 'https://businessasesores.web.app'; // Dominio de tu frontend
  const origin = event.headers.origin;

  // Verificar CORS
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

  // Verificar que se envíe el dominio
  if (!domain) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'El parámetro "domain" es obligatorio.' }),
    };
  }

  try {
    // Realizar solicitud a la API de WHOIS
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Retornar datos para dominios registrados
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        result: 'registered',
        domain,
        whois: response.data,
      }),
    };
  } catch (error) {
    // Manejo de dominios no registrados o errores 404
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ result: 'available', domain }),
      };
    }

    // Manejar errores generales
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Error interno en el servidor.' }),
    };
  }
};


