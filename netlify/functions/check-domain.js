
const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
   // Declare and assign the allowedOrigin variable
  const allowedOrigin = 'https://businessasesores.web.app';

  // Access headers using the new event structure
  const origin = event.headers['origin'];

      
      if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
    };
  }



  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000
    });

     
 if (response.status === 200) {
      // Adjust this part according to your Whois API response structure
      if (!response.data) {
        return {
          statusCode: 200,
          body: JSON.stringify({ result: 'El dominio está registrado' })
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio está disponible' === 'registered'})
        };
      }

    
  } catch (message) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message : 'el dominio esta disponible?' })
    };
  }
};

