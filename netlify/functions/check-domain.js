const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Tu API key
  const allowedOrigin = 'https://businessasesores.web.app'; // Origen permitido (tu frontend)

  // Manejo de CORS para solicitudes válidas
  const origin = event.headers.origin;
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,  // Permitir acceso desde tu frontend
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // Métodos permitidos
        'Access-Control-Allow-Headers': 'Content-Type', // Encabezados permitidos
      },
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' }),
    };
  }

  try {
    // Realizamos la solicitud a la API de Whois
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Si encontramos el dominio en la respuesta, devolvemos 'registered'
    if (response.data.status === 'registered') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin, // Permitir CORS
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result: 'registered' }), // Dominio registrado
      };
    }

    // Si el dominio no está registrado, devolvemos 'available'
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // Permitir CORS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result: 'available' }), // Dominio disponible
    };
  } catch (error) {
    // Manejo de errores generales
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // Permitir CORS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Error en la consulta de Whois' }),
    };
  }
};
