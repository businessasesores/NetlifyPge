// Importamos el SDK de MercadoPago
const mercadopago = require('mercadopago');

// Usamos directamente el token en lugar de la variable de entorno
mercadopago.configurations.setAccessToken('APP_USR-7637184600887888-040602-c75180a883ad24b9c38576741213cb60-1040849203'); // Asegúrate de usar tu token

exports.handler = async (event, context) => {
  try {
    // Crear una preferencia de pago para la prueba
    const preference = {
      items: [
        {
          title: 'Test Item',
          quantity: 1,
          unit_price: 100.0,
        },
      ],
    };

    const response = await mercadopago.preferences.create(preference);

    // Si todo está bien, devolvemos el ID de la preferencia creada
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: response.body.id,
      }),
    };
  } catch (error) {
    console.error("Error al crear la preferencia", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creando la preferencia', error: error.message }),
    };
  }
};
