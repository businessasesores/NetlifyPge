
const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno
   const origin = event.request?.headers?.get('Origin'); // Usamos el operador de encadenamiento opcional para evitar errores si headers es undefined
    const allowedOrigin = 'https://businessasesores.web.app';
      
    


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

       // CORS validation (optional, assuming CORS is configured on Netlify)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Solicitud no autorizada: Origen no permitido' }),
      };
    };


     return  {
          statusCode: 200,
          body: JSON.stringify({ result: 'El dominio está disponible' (response.data.result === 'registered') })
        };  

    

    
  } catch (message) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message : 'el dominio esta disponible?' })
    };
  }
};

