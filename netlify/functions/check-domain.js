const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  const apiKey = process.env.API_KEY; 



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