const mercadopago = require('mercadopago');

const accessToken = 'APP_USR-7637184600887888-040602-c75180a883ad24b9c38576741213cb60-1040849203'; // Pone aquí tu Access Token directamente

// Configuración del token de acceso
mercadopago.configurations.setAccessToken(accessToken);

// Esta parte es para gestionar la creación de una preferencia, si lo necesitas
exports.handler = async (event, context) => {
  try {
    const preference = {
      items: [
        {
          title: 'Test Item',
          quantity: 1,
          unit_price: 100.0
        }
      ]
    };

    // Crea la preferencia
    const response = await mercadopago.preferences.create(preference);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: response.body.id
      })
    };

  } catch (error) {
    console.error("Error creating preference:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error en la creación de la preferencia',
        error: error.message
      })
    };
  }
};
