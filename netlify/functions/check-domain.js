const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
  // Verificar el origen de la solicitud
const allowedOrigin = 'https://buscador.hostweb.workers.dev';
const origin = event.headers.get('Origin');
if (origin !== allowedOrigin) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' })
  };
}

// Verificar el token de autenticación
const authToken = event.headers.get('Authorization');
const expectedToken = process.env.AUTH_TOKEN;
if (authToken !== `Bearer ${expectedToken}`) {
  return {
    statusCode: 401,
    body: JSON.stringify({ error: 'Unauthorized' })
  };
}


  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio' })
    };
  }
};