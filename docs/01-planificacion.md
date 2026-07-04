# 01 — Planificación del Proyecto

---

## Roadmap del Proyecto — Enfoque MVP

El proyecto se divide en tres fases incrementales. Cada fase entrega algo funcional y usable sin necesidad de esperar a tener todo terminado.

### Fase 1 — MVP: Presencia Digital
*Objetivo: tener el sitio online con la información esencial de Flowness.*

- [x] Relevamiento del emprendimiento
- [x] Definición de requerimientos funcionales y no funcionales
- [x] Mapa del sitio
- [x] Flujos de usuario
- [x] Wireframes desktop y mobile
- [x] Stack tecnológico definido
- [x] Estructura base en React + Vite
- [x] Componentes Header, Main y Footer
- [x] Estilizado con Tailwind CSS
- [x] Deploy en Vercel
- [x] Landing page completa (hero, 6 fases, sobre mí)
- [x] Catálogo de cursos visible (sin compra)
- [x] Galería de fotos y videos de muestra
- [x] Formulario de contacto

### Fase 2 — Comercial: El Negocio Funciona
*Objetivo: Usuario final puede vender cursos y gestionar clases online.*

- [x] Registro e inicio de sesión (JWT)
- [x] Compra de cursos
- [x] Videos protegidos para usuarios con compra confirmada
- [x] Reserva de clases online
- [x] Mi cuenta (cursos comprados)
- [x] Backend Node.js + Express
- [x] Base de datos PostgreSQL + Prisma
- [x] Configuración de Redis para caching de sesiones y catálogo
- [x] Deploy backend en Railway

### Fase 3 — Administración: Autonomía Total
*Objetivo: Usuario final gestiona todo el sitio sin ayuda técnica.*

- [x] Panel de control (estadísticas generales)
- [x] Gestión de cursos y videos privados
- [x] Gestión de clases online y horarios
- [x] Actualización de precios
- [x] Publicación de avisos y novedades
- [x] Videos de muestra para publicidad
- [x] Galería de fotos
- [x] Gestión de usuarios

---

## Requerimientos Funcionales (RF)

| ID | Descripción |
|---|---|
| RF1 | El sistema debe permitir a los usuarios registrarse e iniciar sesión |
| RF2 | El sitio debe mostrar un catálogo de cursos con nombre, descripción, nivel y precio |
| RF3 | El sistema debe permitir comprar un curso y habilitar el acceso al contenido una vez confirmado el pago |
| RF4 | Solo los usuarios con compra confirmada podrán visualizar los videos protegidos |
| RF5 | El sitio debe permitir reservar y acceder a clases online en vivo |
| RF6 | La administradora debe poder subir videos, crear cursos, modificar precios, gestionar horarios, publicar avisos, subir videos de muestra y gestionar la galería de fotos sin conocimientos técnicos |
| RF7 | El sitio debe mostrar la historia de Flowness, las seis fases del método, galería de fotos y videos gratuitos de muestra por fase |
| RF8 | El sitio debe incluir una ventana emergente con links a las redes sociales de Vibra |
| RF9 | Los visitantes deben poder enviar consultas a través de un formulario de contacto |
| RF10 | El sitio debe mostrar la historia personal de la creadora y su trayectoria profesional |
| RF11 | La administradora debe poder publicar avisos y novedades visibles en el sitio |
| RF12 | La administradora debe poder subir clips cortos de cada fase del método para promocionar los cursos |

---

## Requerimientos No Funcionales (RNF)

| ID | Descripción |
|---|---|
| RNF1 | **Disponibilidad Offline:** El sitio debe poder visualizarse sin conexión a internet mediante PWA y Service Workers |
| RNF2 | **Rendimiento:** El sitio debe cargar en menos de 3 segundos en conexiones lentas |
| RNF3 | **Seguridad:** Los videos y cursos comprados deben estar protegidos con acceso solo para usuarios autorizados |
| RNF4 | **Autenticación:** El sistema debe usar JSON Web Tokens (JWT) para proteger las sesiones |
| RNF5 | **Responsive:** El sitio debe verse y funcionar correctamente en celulares, tablets y computadoras |
| RNF6 | **Usabilidad:** El panel de administración debe ser simple e intuitivo para usuarios sin conocimientos técnicos |
| RNF7 | **Escalabilidad:** El sistema debe poder crecer, permitiendo agregar más cursos, niveles e instructores |
| RNF8 | **PWA:** La aplicación debe poder instalarse en el celular como una app nativa |
| RNF9 | **Identidad visual:** El sitio debe respetar el manual de marca Flowness en colores, tipografías y estilo |
| RNF10 | **SEO:** El sitio debe estar optimizado para buscadores mediante HTML semántico y metaetiquetas |