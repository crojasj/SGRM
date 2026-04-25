# Informe de Uso de IA - SGRM PRO

## Proyecto: Sistema de Gestión de Repuestos y Mantenciones
## Fecha: Abril 2026
## Herramienta IA utilizada: ChatGPT (GPT-4)

---

## 📋 TABLA DE PROMPTS UTILIZADOS

| # | Prompt | Mejora aplicada |
|:--|:-------|:----------------|
| 1 | "Necesito desarrollar una aplicación web para gestión de inventario de repuestos y mantenciones. Debe tener formularios con validaciones, manipulación del DOM, arreglos de objetos, funciones reutilizables y prevención de XSS." | Estructura base del proyecto con HTML, CSS y JavaScript, sistema de pestañas, almacenamiento en localStorage. |
| 2 | "Agrega validación de RUT chileno para el registro de usuarios. El formato puede ser 12.345.678-9 o 12345678-9. Calcula el dígito verificador." | Función `validarRut()` con algoritmo estándar chileno. |
| 3 | "Refactoriza el código para separar responsabilidades: autenticación, CRUD de productos, gestión de stock y mantenciones." | Código organizado en secciones: validaciones, usuarios, productos, stock, mantenciones. |
| 4 | "Agrega un sistema de login y registro con persistencia en localStorage. Usuarios: nombre, apellidos (opcionales), email, RUT y contraseña." | Pantalla de login con pestañas, registro con validaciones, sesión persistente, edición de perfil. |
| 5 | "Necesito poder agregar varios productos en un solo movimiento de stock, ya sea por compra con factura o reingreso de productos no utilizados." | Sistema dinámico de items con botón "+ Agregar producto", selector de operación, validación de factura. |
| 6 | "¿Cómo puedo prevenir XSS en mi aplicación? Uso innerHTML en algunos lugares." | Función `sanitizeHTML()` y uso de `textContent` para evitar inyecciones. |
| 7 | "Agrega funcionalidad de backup y restore para exportar/importar datos en JSON." | Botones Backup/Restore/Audit con exportación e importación de datos. |
| 8 | "En el dashboard debe mostrar alertas de stock crítico (cantidad <= mínimo) y mantenimientos próximos (menos de 7 días)." | Alertas visuales con colores (rojo crítico, naranja bajo), lista de últimos movimientos. |
| 9 | "Genera una expresión regular para validar números de factura (solo números o formato con guiones)." | Regex `/^\d{1,15}$|^\d{1,3}-\d{1,3}-\d{1,10}$/` para validación de facturas. |
| 10 | "¿Cómo estructuro un sistema de pestañas (tabs) sin librerías externas?" | Implementación de tabs con JavaScript vanilla y CSS. |
| 11 | "Necesito un modal para ver detalles del producto con historial de movimientos." | Modal dinámico que muestra detalles del producto y su historial. |
| 12 | "El diseño está feo, mejora la estética con colores modernos, gradientes y animaciones." | Rediseño completo CSS: gradientes morados, glassmorphism, animaciones, tarjetas con glow. |
| 13 | "Haz que el menú principal sea responsive y sticky." | Menú sticky con overflow-x para móviles, diseño adaptativo. |
| 14 | "Agrega una función para que el usuario pueda editar su perfil (nombre, apellidos, contraseña) con verificación de contraseña actual." | Modal de edición de perfil, verificación de contraseña actual, actualización de datos. |
| 15 | "¿Cómo implemento la función de logout que limpie la sesión y vuelva al login?" | Función `clearCurrentUser()` y redirección a pantalla de login. |
| 16 | "Necesito que los datos de cada usuario sean independientes (datos separados por usuario)." | Datos guardados en `sgrm_data_${userId}` para separar información por usuario. |
| 17 | "Agrega notificaciones toast para mostrar mensajes de éxito/error al usuario." | Función `showToast()` con animación slideIn y diferentes colores según tipo. |
| 18 | "¿Cómo hago que el inventario tenga filtros por búsqueda y por tipo de stock?" | Filtros en tiempo real: búsqueda por texto, filtro por stock crítico/bajo/ok. |
| 19 | "Al registrar un producto, guarda automáticamente el historial de la cantidad inicial." | Historial con timestamp y motivo al crear producto con stock inicial. |
| 20 | "Necesito un código único para cada producto generado automáticamente." | Función `generateCode()` que genera códigos como PRD-XXXXXX. |

---

## 📝 DETALLE DE CADA PROMPT Y MEJORA

### Prompt 1 - Estructura inicial
**Prompt:** "Necesito desarrollar una aplicación web para gestión de inventario de repuestos y mantenciones. Debe tener formularios con validaciones, manipulación del DOM, arreglos de objetos, funciones reutilizables y prevención de XSS."

**Mejora aplicada:** Se generó la estructura base con HTML, CSS y JavaScript, sistema de pestañas, almacenamiento en localStorage y datos de ejemplo.

**Código resultado:**
```html
<!-- Estructura base con header, menú, secciones -->
<header class="header">...</header>
<nav class="main-menu">...</nav>
<main class="main-content">...</main>