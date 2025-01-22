const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKeyApilayer = process.env.API_KEY_APILAYER; // Clave API para Apilayer
  const apiKeyNameCom = process.env.API_KEY_NAMECOM;   // Clave API para Name.com
  const allowedOrigin = 'https://businessasesores.web.app';
  const origin = event.headers.origin;

  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada: Origen no permitido' }),
    };
  }

  try {
    // Llamada a la API de Apilayer
    const apilayerPromise = axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKeyApilayer },
      timeout: 8000, // Tiempo máximo de espera para Apilayer
    });

    // Llamada a la API de Name.com
    const nameComPromise = axios.get(`https://api.name.com/v4/domains:check?domain=${domain}`, {
      headers: { Authorization: `Bearer ${apiKeyNameCom}` },
      timeout: 8000, // Tiempo máximo de espera para Name.com
    });

    // Ejecutar ambas llamadas en paralelo
    const [apilayerResponse, nameComResponse] = await Promise.all([apilayerPromise, nameComPromise]);

    // Procesar las respuestas
    const apilayerData = apilayerResponse.data; // Datos de Apilayer
    const nameComData = nameComResponse.data;   // Datos de Name.com

    // Combinar respuestas (puedes personalizar este formato)
    const combinedResponse = {
      apilayer: apilayerData,
      nameCom: nameComData,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(combinedResponse),
    };

  } catch (error) {
    console.error('Error en la función:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ocurrió un error al procesar la solicitud.',
        error: error.message,
      }),
    };
  }
};
