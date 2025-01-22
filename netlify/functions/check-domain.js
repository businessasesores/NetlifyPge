const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; 
  const allowedOrigin = 'https://businessasesores.web.app';

  const origin = event.headers['origin'];

  // Validar origen permitido
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido.' })
    };
  }

  try {
    // Solicitud a la API de WHOIS
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { 'apikey': apiKey },
      timeout: 5000,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error al consultar WHOIS:', error.message);

    return {
      statusCode: 200, // Devolver 200 para evitar errores en el frontend
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: JSON.stringify({ result: 'El dominio no está registrado o es inválido.' }),
    };
  }
};


