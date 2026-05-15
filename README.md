# SGRM PRO - Sistema Inteligente de Gestión de Repuestos y Mantenciones

SGRM PRO es una Single Page Application (SPA) desarrollada con React orientada a la gestión industrial de mantenciones preventivas y correctivas.

## Características

- Login y validación de roles de usuario
- Gestión de inventario y repuestos
- CRUD de mantenciones
- Dashboard inteligente con indicadores
- Alertas de stock crítico (WhatsApp y Email)
- Interfaz responsive y estética profesional

## Tecnologías Utilizadas

- **Frontend:** React, Vite
- **Estilos:** CSS Vanilla (variables y gradientes), Bootstrap 5
- **Enrutamiento:** React Router DOM
- **Peticiones HTTP:** Axios
- **Íconos:** React Icons
- **Notificaciones Externas:** EmailJS, WhatsApp Web
- **Persistencia:** Local Storage
- **IA Asistente:** Herramientas automatizadas para generación de código

## Instalación y Ejecución

Si bien este proyecto fue creado con Vite, requiere Node.js para ejecutarse localmente.

1. Asegúrate de tener Node.js instalado.
2. Clona o descarga el repositorio y abre una terminal en la carpeta `sgrm-pro`.
3. Ejecuta `npm install` para instalar las dependencias.
4. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.

## Arquitectura y Estado

El estado global se maneja a través de React Context (`AuthContext` y `AppContext`). Se implementaron hooks (`useState`, `useEffect`) para la reactividad y Local Storage para la persistencia de datos.

### Seguridad y Validaciones
- **XSS:** Se utiliza la función `sanitizeInput` para limpiar los inputs antes de procesarlos.
- **Validación RUT:** Algoritmo de validación de RUT chileno en el login.
- **Rutas Protegidas:** Implementadas mediante un componente envoltorio que evalúa el estado de autenticación y los roles.

## API Pública

Se dejó la configuración base para consumir `https://jsonplaceholder.typicode.com/users` en `services/api.js`.

## Integración con EmailJS y WhatsApp

Se configuraron los servicios para alertar automáticamente cuando un producto llega a su stock crítico. Las credenciales de EmailJS se deben configurar en `services/emailService.js`.
