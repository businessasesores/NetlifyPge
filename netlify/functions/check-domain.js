const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2)); // Log the event object for debugging

  // Verifica el origen de la solicitud (restringe el acceso al origen permitido)
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; // Reemplaza con tu origen permitido
  const origin = event.headers.get('Origin');
  if (!event || !event.request || !event.request.headers || origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' }),
    };
  }

  // Verifica la autenticación (opcional, agrega si es necesario)
  const authorization = event.headers.get('Authorization');
  const expectedToken = process.env.AUTH_TOKEN;
  if (authorization && authorization !== `Bearer ${expectedToken}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Extrae el dominio de los parámetros de la cadena de consulta
  const domain = event.queryStringParameters.domain;

  // Validación opcional del dominio (agrega lógica si es necesario)

  // Realiza la solicitud a la API de Whois usando Axios
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error verifying domain' }),
    };
  }
};