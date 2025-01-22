const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const origin = event.headers.origin || event.headers['x-forwarded-for'];
  const secretHeader = event.headers['x-worker-secret']; // Header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto almacenado en Netlify
  const apiKey = process.env.apiKey; // Variable para la API de apilayer
  const apiKeyNameCom = process.env.apiKeyNameCom; // Variable para la API de Name.com

  // Validación del secreto para permitir solo solicitudes autorizadas
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    // Llamadas a las APIs
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
      timeout: 8000,
    });

    const nameComPromise = axios.get(`https://api.name.com/v4/domains:check?domain=${domain}`, {
      headers: { Authorization: `Bearer ${apiKeyNameCom}` },
      timeout: 8000,
    });

    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    // Combinar respuestas
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
