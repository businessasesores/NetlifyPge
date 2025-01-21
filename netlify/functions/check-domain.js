const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; 
  const origin = event.headers['origin'];
  const allowedOrigin = 'https://businessasesores.web.app';


  try {

    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey

      },

      timeout: 5000

    });

      if (response.status === 200) {
    if (response.data.status === 'registered') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'El dominio está registrado' })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'El dominio está disponible' })
      };
    }
  } else if (response.status === 404) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Dominio no encontrado' })
    };
  } else {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'Error al obtener datos de Whois' })
    };
  }
} catch (error) {
  console.error('Error:', error);
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Error interno del servidor' })
  };
}

};