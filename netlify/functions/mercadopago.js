const mercadopago = require('mercadopago'); 

// Acceder al Access Token desde las variables 
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// Asegúrate de que el Access Token esté disponible
if (!accessToken) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Access Token no configurado en las variables de entorno.' }),
  };
}

// Configurar MercadoPago con el Access Token
mercadopago.configurations.setAccessToken(accessToken);

// (Opcional) Si necesitas el Public Key en algún punto del backend, también podrías configurarlo
// (Normalmente se usa en el frontend, no en el backend, pero si necesitas puedes agregarlo aquí)
const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY; 

if (!publicKey) {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: 'Public Key no configurado en las variables de entorno.' }),
  };
}

// Configuración de la preferencia de pago
exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { dominios, total } = JSON.parse(event.body);  // Datos enviados desde el frontend

    // Crea la preferencia de pago
    const preference = {
      items: [
        {
          title: dominios,  // Nombre del dominio
          quantity: 1,
          currency_id: 'COP',  // O 'USD', según tu moneda
          unit_price: total  // El precio total
        }
      ],
      back_urls: {
        success: 'https://businessasesores.web.app/',  // URL de éxito
        failure: 'https://businessasesores.web.app/',  // URL de error
        pending: 'https://businessasesores.web.app/'   // URL de pendiente
      },
      auto_return: 'approved'  // Regresar automáticamente al usuario después del pago
    };

    try {
      // Crear la preferencia
      const response = await mercadopago.preferences.create(preference);

      // Devuelve la URL de pago
      return {
        statusCode: 200,
        body: JSON.stringify({ init_point: response.body.init_point }),
      };
    } catch (error) {
      // Manejo de errores
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al crear la preferencia de pago', error }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }
};

