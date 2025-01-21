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

       // Check response status code for successful request (200)
    if (response.status === 200) {
      // Adjust this part according to your Whois API response structure
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
    } else {
      return {
        statusCode: response.status, // Return the actual status code from the API
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