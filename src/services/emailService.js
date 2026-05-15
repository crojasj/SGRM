import emailjs from '@emailjs/browser';

// Reemplazar con credenciales reales
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendEmailAlert = async (product) => {
  try {
    const templateParams = {
      product_name: product.name,
      product_code: product.code,
      stock: product.quantity
    };

    // Esto fallará si no hay credenciales reales, por lo que lo envolvemos en try-catch
    if (SERVICE_ID !== 'YOUR_SERVICE_ID') {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log(`Email alert sent for ${product.name}`);
    } else {
      console.warn('EmailJS no configurado. Alerta de correo simulada para:', product.name);
    }
  } catch (error) {
    console.error('Error enviando alerta de correo:', error);
  }
};
