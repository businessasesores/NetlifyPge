
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
        // Handle empty response (e.g., domain not found)
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio no se encontró o hubo un error en la consulta' })
        };
      } else {
        const isAvailable = response.data.status !== 'registered'; // Assuming 'registered' indicates unavailable
        return {
          statusCode: 200,
          body: JSON.stringify({ message: isAvailable ? 'El dominio está disponible' : 'El dominio está registrado' })
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
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
};