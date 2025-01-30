const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain; // Obtenemos el dominio de los parámetros
  const secretHeader = event.headers['x-worker-secret']; // Obtenemos el header personalizado
  const expectedSecret = process.env.WORKER_SECRET; // El secreto esperado
  const apiKey = process.env.API_KEY; // API Key para Apilayer

  // Validar el header del secreto
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    // Llamada directa a la API de Apilayer
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Devolver la respuesta tal cual viene de Apilayer
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error al consultar el dominio.',
        error: error.message,
      }),
    };
  }
};
