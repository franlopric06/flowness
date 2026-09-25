# 06 — Changelog


---

## Registro de Avances y Commits

Este archivo registra los cambios más relevantes del proyecto ordenados por fecha, junto con los commits correspondientes en GitHub.

---

## Etapa 1

| Descripción | Fecha |
|---|---|
| Inicio proyecto Flowness con React y Vite | 05/06/2026 |
| Agregamos componentes Header, Main y Footer | 05/06/2026 |
| Agregamos README.md con documentación del proyecto Flowness | 05/06/2026 |
| Estilizamos componentes Header, Main y Footer con Tailwind CSS | 05/06/2026 |
| Actualizamos index.html con idioma español y titulo de sitio | 05/06/2026 |
| Desplegamos el proyecto en Vercel | 05/06/2026 |
| Agregamos el favicon de Folwness | 05/06/2026 |
| Agregamos análisis técnico SPA y PWA al README.md | 12/06/2026 |

---

## Etapa 2 — Planificación y Arquitectura (Junio 2026)

| Descripción | Fecha |
|---|---|
| Agregamos la carpeta docs con documentacion tecnica | 16/06/2026 |
| Agregamos componente Catalogo con mock data de cursos| 16/06/2026 |
| Agregamos componente Galeria con mock data | 16/06/2026 |
| Agregamos componente SobreMi | 16/06/2026 |
| Agregamos componente Contacto | 16/06/2026 |
| Actualizamos el Main.jsx con las 6 fases del metodo | 16/06/2026 |
---

## Etapa 3 — Construcción y Optimización (Junio 2026)

|Descripción | Fecha |
|---|---|
| Agregamos React Router y estructura de paginas | 25/06/2026 |
| Agregamos pagina de Login y Registro | 25/06/2026 |
| Agregamos pagina El Metodo con las 6 fases detalladas | 25/06/2026 |
| Agregamos pagina Clases Online con horarios y precios | 25/06/2026 |
| Reorganizo navegacion y flujo entre paginas | 25/06/2026 |
| Agregamos popup de Vibra | 25/06/2026 |
| Agregamos ScrollToTop para que cada pagina empiece desde arriba | 25/06/2026 |
| Agregamos Footer completo con navegacion y contacto | 25/06/2026 |
| Corrijo navegacion, header con logo y padding de paginas | 25/06/2026 |
| Agregamos SEO con metadatos y Open Graph en todas las paginas | 25/06/2026 |
| Agregamos JSON-LD, robots.txt y sitemap.xml para SEO | 25/06/2026 |
| Agregamos headers de seguridad en vercel.json | 25/06/2026 |
| Agregamos validacion y sanitizacion al formulario de contacto | 25/06/2026 |
| Agregamos docs/07-ia-aplicada.md con bitacora de uso de IA | 25/06/2026 |
| Agregamos backend con Node.js, Express, Prisma y autenticacion JWT | 25/06/2026
|  

## Próximos pasos
- [x] Configurar base de datos PostgreSQL con Prisma
- [x] Implementar autenticación con JWT
- [x] Integrar pasarela de pagos con Mercado Pago
- [x] Desarrollar panel de administración
- [x] Deploy backend en Railway

---


---

## Reorganización modular y seguridad (Septiembre 2026)

| Descripción | Fecha |
|---|---|
| Quitamos los archivos .env del repositorio y agregamos .gitignore en la raíz y en el backend | 24/09/2026 |
| Quitamos node_modules del repositorio | 24/09/2026 |
| Completamos .env.example del backend y del frontend con todas las variables necesarias | 24/09/2026 |
| Agregamos validación de variables de entorno al iniciar el servidor | 24/09/2026 |
| Restringimos CORS al dominio del frontend (FRONTEND_URL) | 24/09/2026 |
| Reorganizamos el backend por módulos (auth, usuarios, fases, clases, pagos, media, admin, avisos, sobre-mi, configuracion, publico) | 24/09/2026 |
| Separamos app.js (configuración de Express) de index.js (arranque del servidor) | 24/09/2026 |
| Reorganizamos el frontend por módulos y dividimos api.js en servicios por módulo | 24/09/2026 |
