const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // La clave de la API almacenada como variable de entorno
  const origin = event.headers['origin']; // El origen de la solicitud (para validar CORS)
  const allowedOrigin = 'https://businessasesores.web.app'; // El origen permitido

  // Verificar CORS antes de hacer la solicitud a la API
  if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ result: 'Solicitud no autorizada: Origen no permitido' })
    };
  }

  try {
    // Realizar la solicitud a la API de whois
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey // Pasar la API Key en los encabezados
      },
      timeout: 5000 // Establecer un tiempo de espera de 5 segundos
    });

    // Responder con los datos obtenidos de la API
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // Agregar el encabezado CORS para permitir el acceso al frontend
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Métodos permitidos
        'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Encabezados permitidos
      }
    };

  } catch (error) {
    // En caso de error, responder con un mensaje adecuado
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Hubo un error al procesar la solicitud del dominio.' })
    };
  }
};
