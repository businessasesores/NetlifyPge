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

<<<<<<< HEAD
<<<<<<< HEAD
     
return {
       statusCode: 200,
=======
=======
>>>>>>> parent of 65ed498 (booomm)
    return {
      statusCode: 200,
>>>>>>> parent of 65ed498 (booomm)
      body: JSON.stringify(response.data)
      
    };
<<<<<<< HEAD
<<<<<<< HEAD

     // CORS validation (optional, assuming CORS is configured on Netlify)
    if (origin !== allowedOrigin) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Solicitud no autorizada: Origen no permitido' }),
      };
    };


     return  {
          statusCode: 200,
          body: JSON.stringify({ result: 'El dominio está disponible' (response.!data.result === 'registered') })
        };  

    

    
  } catch (message) {
=======
=======
>>>>>>> parent of 65ed498 (booomm)
  } catch (error) {
    console.error('Error:', error);
>>>>>>> parent of 65ed498 (booomm)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'el dominio esta disponible?' })
    };
  }
};
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> parent of 65ed498 (booomm)
=======
>>>>>>> parent of 65ed498 (booomm)
