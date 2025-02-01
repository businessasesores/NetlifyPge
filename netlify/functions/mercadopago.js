const mercadopago = require('mercadopago');

// Verifica que el token esté presente antes de intentar usarlo
if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error('El Access Token no está configurado correctamente en las variables de entorno.');
}

// Configura MercadoPago con el token de acceso
mercadopago.configurations.setAccessToken(process.env.MERCADO_PAGO_ACCESS_TOKEN);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { dominios, total } = JSON.parse(event.body);  // Datos enviados desde el frontend

    // Crear la preferencia de pago
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
