const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const secretHeader = event.headers['x-worker-secret'];
  const expectedSecret = process.env.WORKER_SECRET;
  const apiKey = process.env.API_KEY;



   if (secretHeader !== expectedSecret) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'Solicitud no autorizada. Secreto inválido.' }),
    };
  }

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


    


  } catch (message) {

    return {

      statusCode: 500,

      body: JSON.stringify({ message: 'el dominio esta disponible?' })

    };

  }

};

