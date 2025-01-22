const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const origin = event.headers.origin || event.headers['x-forwarded-for'];
  const secretHeader = event.headers['x-worker-secret']; // Header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto almacenado en Netlify
  const apiKey = process.env.API_KEY; // Apilayer
  const apiKeyNameCom = process.env.API_KEY_NAMECOM; // Name.com

  // Validación del secreto para permitir solo solicitudes autorizadas
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    // Llamada a la API de Apilayer para verificar disponibilidad
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey, // Verifica que la clave no tenga espacios en blanco ni caracteres adicionales
      },
      timeout: 5000,
    });

    // Llamada a la API de Name.com para verificar disponibilidad
    const nameComPromise = axios.get(`https://api.name.com/v4/domains:check?domain=${domain}`, {
      headers: {
        Authorization: `Bearer ${apiKeyNameCom}`,
      },
      timeout: 8000,
    });

    // Espera ambas respuestas (Apilayer y Name.com) usando Promise.all
    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    // Combinar las respuestas y enviarlas
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Permite cualquier origen (ajústalo según tus necesidades)
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apilayer: apilayerResponse.data,
        nameCom: nameComResponse.data,
      }),
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando la solicitud.', error: error.message }),
    };
  }
};
