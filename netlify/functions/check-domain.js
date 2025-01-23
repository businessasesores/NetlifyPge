const fetch = require('node-fetch');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain; // Dominio desde los parámetros
  const secretHeader = event.headers['x-worker-secret']; // Secreto recibido desde el encabezado
  const expectedSecret = process.env.WORKER_SECRET; // Secreto almacenado en Netlify
  const apiKey = process.env.API_KEY; // API Key de Apilayer desde las variables de entorno

  // Validar el encabezado secreto
  if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

  try {
    // Llamada a la API de Apilayer
    const response = await fetch(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: { apikey: apiKey },
    });

    // Procesar la respuesta de la API
    if (!response.ok) {
      throw new Error(`API de Apilayer respondió con un estado ${response.status}`);
    }

    const data = await response.json();

    // Devolver la respuesta con los datos de la API
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error procesando la solicitud:', error.message);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Error procesando la solicitud.', error: error.message }),
    };
  }
};


