// netlify/functions/webhook.js
const mercadopago = require('mercadopago');

// Acceder al Access Token de MercadoPago desde la variable de entorno
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
mercadopago.configurations.setAccessToken(accessToken);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body);  // Datos enviados por MercadoPago

    // Verificar el estado de la transacción
    const paymentId = data.data.id;
    try {
      const payment = await mercadopago.payment.get(paymentId);
      const paymentStatus = payment.body.status;

      // Dependiendo del estado del pago, puedes manejar la lógica aquí (por ejemplo, actualizar el estado de la compra)
      if (paymentStatus === 'approved') {
        // Pago aprobado, actualizar el estado de la compra en tu base de datos
        console.log('Pago aprobado:', payment.body);
      } else {
        console.log('Pago no aprobado:', payment.body);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook procesado correctamente' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error al procesar el webhook', error }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }
};
