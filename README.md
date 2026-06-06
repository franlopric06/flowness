# Flowness — Plataforma Web PWA

> Movilidad, Flexibilidad y Mindfulness

---

## PASO 1: Organización de la Información y Roadmap

### A. Necesidades del Cliente

| Campo | Detalle |
|---|---|
| **Nombre** | Flowness |
| **Rubro** | Salud y bienestar |
| **Ubicación** | Hipólito Irigoyen 383, Tinogasta, Catamarca |
| **Redes sociales** | Instagram @flownessargentina |

Flowness es un método propio de movilidad, flexibilidad y mindfulness creado por una kinesióloga de la ciudad de Tinogasta. Estructurado en seis fases progresivas, con registro de marca a nivel nacional en las categorías de fitness, salud, formación y educación.

**Problemas principales que el sitio web resolverá:**

* **Falta de presencia digital:** Flowness es un proyecto nuevo que busca lanzarse al mundo digital con una plataforma propia para llegar a personas de todo el país.
* **Dependencia de plataformas externas:** Para vender cursos necesitaría depender de terceros. El sitio le dará autonomía total para vender cursos grabados y clases online.
* **Alcance limitado:** Sin un sitio web propio, el método solo puede llegar a personas de Tinogasta. La plataforma permitirá expandirse a nivel nacional.

### B. Limitaciones del Entorno

* **Conectividad:** Al apuntar a usuarios de todo el país, incluyendo zonas rurales con señal limitada, el sitio debe funcionar offline mediante PWA.
* **Presupuesto:** Al ser un emprendimiento en crecimiento, se priorizan herramientas gratuitas como Vercel para el despliegue.
* **Conocimientos técnicos:** La dueña no tiene conocimientos de programación, por lo que el panel de administración debe ser simple e intuitivo.

### C. Roadmap de Desarrollo

- [x] Relevamiento del emprendimiento
- [x] Definición de requerimientos funcionales y no funcionales
- [x] Mapa del sitio
- [x] Flujo de usuario
- [x] Stack tecnológico
- [x] Wireframes
- [x] Estructura base en React + Vite
- [x] Componentes Header, Footer y Main
- [ ] Configuración PWA y Service Worker
- [ ] Backend con Node.js y Express
- [ ] Base de datos con PostgreSQL y Prisma
- [ ] Autenticación con JWT
- [ ] Panel de administración
- [x] Despliegue en Vercel

---

## PASO 2: Requerimientos Funcionales y No Funcionales

### Requerimientos Funcionales (RF)
> Definen las acciones específicas que el sistema debe permitir. Responden a: ¿Qué hace el sitio?

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

### Requerimientos No Funcionales (RNF)
> Definen las propiedades y restricciones del sistema. Responden a: ¿Cómo lo hace?

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

---

## PASO 3: Arquitectura de la Información (Mapa del Sitio)

```
Flowness
├── Inicio
│   ├── Historia y filosofía de Flowness
│   ├── Las 6 fases del método
│   ├── Videos de muestra gratuitos por fase
│   └── Llamado a la acción (registrarse o comprar)
├── Sobre mí
│   ├── Historia personal de la creadora
│   └── Formación y trayectoria profesional
├── El Método
│   └── Descripción detallada de las 6 fases
├── Cursos
│   ├── Catálogo (básico, intermedio y avanzado)
│   └── Página individual de cada curso
├── Clases Online
│   ├── Horarios disponibles
│   └── Cómo reservar
├── Galería
│   ├── Fotos
│   └── Videos de muestra gratuitos
├── Contacto
│   └── Formulario de contacto
└── Vibra
    └── Ventana emergente con links a redes sociales

Área privada (usuarios registrados con compra confirmada)
├── Mi cuenta
└── Mis cursos comprados

Panel de administración (solo la administradora)
├── Panel de control (estadísticas generales)
├── Gestión de cursos y videos privados
├── Gestión de clases online
├── Actualización de precios
├── Publicación de avisos y novedades
├── Videos de muestra para publicidad
├── Galería de fotos
└── Gestión de usuarios
```
---

## PASO 4: Flujo de Información y Navegación (User Flow)

### Flujo 1: Comprar un curso
### Flujo 2: Reservar una clase online

[Ver flujos en Figma](https://www.figma.com/design/cTGOwbukaB7mQfRIttqhRu/Sin-t%C3%ADtulo?node-id=0-1&m=dev&t=X3SrpyPBlo5td9w4-1)

---

## PASO 5: Prototipado Estático (Wireframes)

Los wireframes de baja fidelidad representan la distribución visual de los bloques principales de cada pantalla, definiendo la ubicación del logo, menú, secciones y tarjetas de contenido antes de comenzar el desarrollo.

[Ver wireframes en Figma](https://www.figma.com/design/cTGOwbukaB7mQfRIttqhRu/Sin-t%C3%ADtulo?node-id=0-1&m=dev&t=X3SrpyPBlo5td9w4-1)
---

## PASO 6: Stack Tecnológico

> Herramientas seleccionadas basadas en el Stack B (Asíncrono de Alta Concurrencia) del apunte de cátedra, adaptado con PostgreSQL por la naturaleza estructurada de los datos.

| Tecnología | Rol en el proyecto | Justificación técnica |
|---|---|---|
| React | Framework frontend | Permite construir una SPA con componentes reutilizables y navegación fluida sin recargar la página |
| Vite | Build tool | Agiliza el desarrollo y optimiza el rendimiento del proyecto React |
| Node.js + Express | Backend | Modelo I/O No Bloqueante ideal para operaciones de lectura/escritura concurrentes como streaming de videos y compras |
| PostgreSQL | Base de datos | Base de datos relacional que garantiza integridad transaccional en compras y accesos a cursos |
| Prisma | ORM | Facilita la interacción con la base de datos usando JavaScript sin escribir SQL manual |
| JWT | Autenticación | Diseño stateless que permite escalabilidad horizontal y protege sesiones de usuarios |
| Git + GitHub | Control de versiones | Registro del historial de cambios y trabajo colaborativo |
| Vercel | Despliegue | Plataforma gratuita para desplegar el frontend automáticamente con cada cambio |
| Railway | Despliegue Backend | Plataforma gratuita para desplegar el backend Node.js y la base de datos PostgreSQL en la nube |
| PWA + Service Worker | Funcionalidad offline | Permite que el sitio funcione sin conexión y se instale como app en el celular |

### Configuración del Manifiesto PWA

```json
{
  "name": "Flowness",
  "short_name": "Flowness",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#F5F0EB",
  "theme_color": "#7B9B77"
}
```
