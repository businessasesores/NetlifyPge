const axios = require('axios');

exports.handler = async (event) => {
    const domain = event.queryStringParameters.domain;
    const apiKey = process.env.API_KEY; // Obtener la clave de API desde una variable de entorno
    const allowedOrigin = 'https://businessasesores.web.app';
    const origin = event.headers.origin;

    // Validar el origen de la solicitud
    if (origin !== allowedOrigin) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Solicitud no autorizada: Origen no permitido' })
        };
    }

    // Validar el formato del dominio
    const domainRegex = /^[a-z0-9]+(-*[a-z0-9]+)*(\.([a-z0-9]+(-*[a-z0-9]+)*))*$/i;
    if (!domainRegex.test(domain)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Formato de dominio inválido' })
        };
    }

    try {
        // Realizar la solicitud a la API de Whois
        const response = await axios.get(`https://api.apilayer.com/whois/query?domain=${domain}`, {
            headers: {
                'apikey': apiKey
            }
        });

        // Verificar la respuesta de la API
        if (response.status === 200 && response.data && typeof response.data.status === 'string') {
            return {
                statusCode: 200,
                body: JSON.stringify(response.data)
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error al obtener datos del dominio.' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al procesar la solicitud del dominio.' })
        };
    }
};