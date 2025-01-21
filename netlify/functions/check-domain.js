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

      if (origin !== allowedOrigin) {
    return {
      statusCode: 403,
      body: JSON.stringify({ result: 'Solicitud no autorizada: Origen no permitido' })
    };
  }


     
      } else { 
        return {
          statusCode: 200,
          body: JSON.stringify(response.data)
        };
      }
      return {
     statusCode: 200,
      body: JSON.stringify(!data.available)({ result: 'El dominio está disponible' })
       };
        
   
  } catch (message) {

    return {

      statusCode: 500,

      body: JSON.stringify({ message: 'el dominio esta disponible?' })

    };

  };

