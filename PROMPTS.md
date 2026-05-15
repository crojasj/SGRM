# Documentación de Uso de IA - SGRM PRO

Durante el desarrollo de esta aplicación, se utilizó asistencia de Inteligencia Artificial para generar y estructurar código. A continuación, se documentan algunos de los "prompts" (instrucciones) y los resultados obtenidos.

---

## Prompt 1
> "Cómo estructurar una aplicación React Vite para gestión de mantenciones con roles de usuario, Dashboard y persistencia en LocalStorage."

**Resultado:**
La IA generó un plan arquitectónico detallado sugiriendo la división en carpetas como `components`, `context`, `services` y `utils`. Recomendó el uso de Context API para manejar el estado global de productos y mantenciones, y para controlar la sesión del usuario persistida en el navegador.

---

## Prompt 2
> "Cómo implementar una tabla de productos con alertas de stock crítico y validación para reserva de materiales por técnicos."

**Resultado:**
Se obtuvo el código para el componente `Products.jsx` y `MaintenanceList.jsx`, incluyendo lógica en el Contexto (`AppContext.jsx`) para detectar cuándo el `stock disponible = stock total - stock reservado` es menor o igual al `stock mínimo`, resaltando estas filas en color amarillo o rojo mediante clases de Bootstrap.

---

## Prompt 3
> "Cómo prevenir XSS y validar RUT chileno en un formulario de Login en React."

**Resultado:**
La IA proporcionó dos utilidades clave:
1. `validarRut(rut)`: Un algoritmo matemático para calcular el dígito verificador y contrastarlo.
2. `sanitizeInput(text)`: Una función usando expresiones regulares (`replace(/[<>]/g, '')`) para limpiar etiquetas HTML y prevenir inyección de scripts, la cual fue aplicada en `Login.jsx` antes de verificar las credenciales.

---

## Prompt 4
> "Cómo configurar alertas automáticas con EmailJS y WhatsApp Web."

**Resultado:**
Se generaron los servicios `emailService.js` (utilizando `@emailjs/browser` y un bloque `try-catch` para enviar los parámetros de plantilla) y `whatsappService.js` (generando una URL de la API de WhatsApp con el mensaje codificado mediante `encodeURIComponent`), y se integraron en un `useEffect` dentro de `AppContext.jsx` que escucha cambios en el array de productos.
