const axios = require('axios');

exports.handler = async (event) => {
  console.log('Event object:', JSON.stringify(event, null, 2)); 

  // Verificar si el objeto 'event' y sus propiedades existen
  if (!event || !event.request || !event.request.headers) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Invalid event format' })
    };
  }

  // Verificar el origen de la solicitud (restringe el acceso al origen permitido)
  const allowedOrigin = 'https://buscador.hostweb.workers.dev'; // Reemplaza con tu origen permitido
  const origin = event.request.headers.get('Origin'); 
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Forbidden: Request origin not allowed' })
    };
  }

  // Verificar la autenticación (opcional)
  // ... (código para autenticación)

  // Extraer el dominio de los parámetros de la cadena de consulta
  const domain = event.queryStringParameters.domain;

  // Validación opcional del dominio (agrega lógica si es necesario)

  // Realizar la solicitud a la API de Whois usando Axios
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