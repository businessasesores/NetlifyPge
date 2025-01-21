const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; // Obtain API key from an environment variable

  try {
    const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKey
      },
      timeout: 5000 // Set a timeout for the API request
    });

    if (response.status === 200) {
      // Adjust this part according to your Whois API response structure
      if (response.data) {
        // Handle empty response (e.g., domain not found)
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'El dominio no se encontró o hubo un error en la consulta' })
        };
      } else {
        const isAvailable = message: == 'registered'; // Assuming 'registered' indicates unavailable
        return {
          statusCode: 200,
          body: JSON.stringify({ message: isAvailable ? 'El dominio está disponible' : 'El dominio está registrado' })
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