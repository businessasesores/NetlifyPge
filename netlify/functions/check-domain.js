const axios = require('axios');

exports.handler = async (event) => {
  const domain = event.queryStringParameters.domain;
  
  // Asegúrate de que tus API Keys están correctamente configuradas en las variables de entorno de Netlify
  const apiKeyApilayer = process.env.API_KEY;   // Clave de apilayer
  const apiKeyNameCom = process.env.API_KEY_NAMECOM; // Clave de name.com

  // Comienza con la consulta de apilayer
  try {
    const responseApilayer = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
      headers: {
        'apikey': apiKeyApilayer,  // Clave API de apilayer
      },
    });

    // Verifica si apilayer dice que el dominio está registrado
    if (responseApilayer.data && responseApilayer.data.status === 'registered') {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: 'registered' }),  // Dominio registrado
      };
    } else {
      // Si apilayer no encuentra el dominio, consulta en name.com
      return await checkDomainWithNameCom(domain);
    }

  } catch (errorApilayer) {
    console.error('Error en la consulta de apilayer:', errorApilayer);
    // Si apilayer falla, intenta con name.com
    return await checkDomainWithNameCom(domain);
  }
};

// Función para verificar el dominio con la API de name.com
const checkDomainWithNameCom = async (domain) => {
  try {
    const responseNameCom = await axios.get(`https://api.name.com/v4/domains/${domain}/available`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY_NAMECOM}`,  // Clave API de name.com
      },
    });

    if (responseNameCom.data && responseNameCom.data.available === true) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: 'available' }),  // Dominio disponible
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: 'not available' }),  // Dominio no disponible
      };
    }

  } catch (errorNameCom) {
    console.error('Error en la consulta de name.com:', errorNameCom);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al verificar el dominio' }),
    };
  }
};
