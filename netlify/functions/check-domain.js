const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { domain } = event.queryStringParameters;
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.apilayer.com/whois/query?domain=${domain}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000
    });

    if (response.status === 200) {
      // Verificar si el dominio está registrado
      if (response.data.result === 'registered') {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está registrado' })
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'El dominio no está registrado' })
        };
      }
    } else {
      console.error('Error en la API de Whois:', response.data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error al obtener datos de Whois', details: response.data })
      };
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};