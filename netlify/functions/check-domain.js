
const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
   const origin = event.request?.headers?.get('Origin'); // Usamos el operador de encadenamiento opcional para evitar errores si headers es undefined
    const allowedOrigin = 'https://buscador.hostweb.workers.dev';


  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000
    });

return {
       statusCode: 200,
      body: JSON.stringify(response.data)
      
    };

     return  {
          statusCode: 200,
          body: JSON.stringify({ messege : 'El dominio está disponible'})
        };  

      // CORS validation (optional, assuming CORS is configured on Netlify)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' }),
      };
    };

    
  } catch (messege) {
    return {
      statusCode: 500,
      body: JSON.stringify({ result : 'el dominio esta disponible?' (response.data.result === 'registered') })
    };
  }
};

