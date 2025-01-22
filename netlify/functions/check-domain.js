const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const secretHeader = event.headers['x-worker-secret']; // Header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto almacenado en Netlify
  const apiKey = process.env.API_KEY; // Variable para la API de Apilayer
  const apiKeyNameCom = process.env.API_KEY_NAMECOM; // Variable para la API de Name.com

  // Validación del secreto para permitir solo solicitudes autorizadas
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey,
      },
      timeout: 5000,
    });

    const nameComPromise = axios.post('https://api.name.com/v4/domains:check', 
      { domainNames: [domain] },
      { headers: { Authorization: `Bearer ${apiKeyNameCom}` }, timeout: 8000 }
    );

    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    // Combinar respuestas
    return {
      statusCode: 200,
      body: JSON.stringify({
        apilayer: apilayerResponse.data,
        nameCom: nameComResponse.data,
      }),
    };
  } catch (error) {
    console.error('Error en la función:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando la solicitud.', error: error.message }),
    };
  }
};
