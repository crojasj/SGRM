export const sendWhatsAppAlert = (product) => {
  const phoneNumber = '56912345678'; // Reemplazar con el número real
  const message = `⚠️ STOCK CRÍTICO\n\nProducto: ${product.name}\nCódigo: ${product.code}\nStock actual: ${product.quantity} unidades`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // En un entorno real se abre la ventana, pero para evitar bloqueos de popup
  // en la simulación, usaremos console.log o dejaremos comentado
  // window.open(url, '_blank');
  console.log('WhatsApp alert URL:', url);
};
