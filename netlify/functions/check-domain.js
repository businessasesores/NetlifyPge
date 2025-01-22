const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain; // Obtenemos el dominio de la query string
  const secretHeader = event.headers['x-worker-secret']; // Header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto almacenado en las variables de entorno de Netlify
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
    // Llamada a la API de Apilayer
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey, // Se pasa la API Key de Apilayer
      },
      timeout: 5000, // Timeout de 5 segundos para la respuesta
    });

    // Llamada a la API de Name.com
    const nameComPromise = axios.post('https://api.name.com/v4/domains:check', 
      { domainNames: [domain] }, // Enviamos el dominio para verificar
      { headers: { Authorization: `Bearer ${apiKeyNameCom}` }, timeout: 8000 } // API Key de Name.com
    );

    // Esperamos ambas respuestas de las APIs de manera simultánea
    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    // Combinamos las respuestas en un solo objeto
    return {
      statusCode: 200,
      body: JSON.stringify({
        apilayer: apilayerResponse.data,
        nameCom: nameComResponse.data,
      }),
    };
  } catch (error) {
    // Si hay algún error, lo manejamos y devolvemos un mensaje adecuado
    console.error('Error en la función:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error procesando la solicitud.', error: error.message }),
    };
  }
};
