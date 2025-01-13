const axios = require('axios');

exports.handler = async (event) => {
    const domain = event.queryStringParameters.domain;
    const apiKey = process.env.API_KEY; // Obtener la clave API desde una variable de entorno

    try {
        const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
            headers: {
                'apikey': apiKey
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al verificar el dominio' })
        };
    }
};