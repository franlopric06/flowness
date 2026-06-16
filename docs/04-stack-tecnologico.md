# 04 — Stack Tecnológico

---

## Stack Tecnológico Seleccionado

Se seleccionó un stack tecnológico completo, gratuito y de código abierto, basado en el **Stack B — Asíncrono de Alta Concurrencia** del apunte de cátedra, adaptado a las necesidades específicas de Flowness.

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Continuidad de la Etapa 1. SPA con componentes reutilizables, estilizado mobile first |
| Backend | Node.js + Express | Modelo I/O No Bloqueante ideal para muchas operaciones de lectura/escritura concurrentes |
| Base de Datos | PostgreSQL | Datos altamente estructurados con integridad transaccional (ACID) para compras y accesos |
| ORM | Prisma | Comunicación con la BD usando JavaScript sin escribir SQL manual |
| Autenticación | JWT | Gestión de sesiones stateless que permite escalabilidad horizontal |
| Caching | Redis | Caché de sesiones JWT y catálogo de cursos para reducir consultas a la BD |
| Deploy Frontend | Vercel | Plataforma gratuita con deploy automático desde GitHub |
| Deploy Backend | Railway | Plataforma gratuita para Node.js y PostgreSQL en la nube |
| PWA + Service Worker | Funcionalidad offline | Permite que el sitio funcione sin conexión y se instale como app en el celular |

---

## Justificación Detallada

### Frontend — React + Vite + Tailwind CSS
React es una librería de JavaScript que permite construir interfaces de usuario divididas en componentes reutilizables. Se eligió porque permite crear una SPA donde la página no se recarga completa al navegar entre secciones, mejorando la experiencia del usuario. Vite acelera el proceso de desarrollo y Tailwind CSS permite diseñar mobile first con clases utilitarias directamente en el JSX. Todo gratuito y de código abierto.

### Backend — Node.js + Express
Node.js usa un modelo de I/O No Bloqueante y Asíncrono, lo que significa que un solo hilo puede atender miles de peticiones al mismo tiempo sin quedarse bloqueado esperando respuestas de la base de datos. Funciona como un mozo que no se queda parado esperando que la cocina termine un plato, sino que sigue tomando pedidos de otras mesas mientras espera. Esto es ideal para Flowness porque las operaciones predominantes son lectura y escritura en la base de datos, y no cálculos intensivos de CPU. Express es el framework que simplifica la creación de la API REST sobre Node.js.

### Base de Datos — PostgreSQL + Prisma
Los datos de Flowness son altamente estructurados y tienen relaciones claras entre sí: un usuario puede tener varias compras, cada compra está relacionada con un curso, y cada curso tiene sus videos. PostgreSQL garantiza mediante las propiedades ACID que las transacciones críticas como pagos y compras se registren correctamente o no se registren en absoluto, sin datos a medias. Prisma actúa como puente entre el código JavaScript y PostgreSQL, permitiendo interactuar con la base de datos sin escribir SQL manual.

### Autenticación — JWT
JWT (JSON Web Token) es un estándar de seguridad para gestionar sesiones de usuario. Cuando alguien inicia sesión en Flowness, el servidor genera un token cifrado que contiene información del usuario, como su ID y su rol (usuario común o administradora). Ese token se guarda en el dispositivo del usuario y se envía automáticamente en cada petición al servidor, por ejemplo cuando quiere ver un video comprado o acceder al panel de administración.
La ventaja principal es que el servidor no necesita recordar quién está conectado, simplemente verifica el token que recibe en cada petición. Esto hace que el sistema sea stateless (sin estado), lo que significa que si en el futuro Flowness crece y necesita más servidores para manejar más usuarios, cualquiera de esos servidores puede verificar el token sin necesitar comunicarse con los demás. Esto facilita enormemente la escalabilidad horizontal del sistema.

### Caching — Redis
Redis funciona como una memoria de acceso rápido. En lugar de consultar PostgreSQL cada vez que alguien quiere ver el catálogo de cursos, el sistema guarda esa información temporalmente en Redis y la entrega desde ahí. Esto hace que el sitio responda más rápido y que la base de datos principal no se sobrecargue con consultas repetidas. Se cachean: catálogo de cursos, horarios de clases disponibles y sesiones JWT.

### Infraestructura — Vercel + Railway
Vercel se usa para el frontend porque tiene integración directa con GitHub: cada push a la rama main publica el sitio automáticamente. Railway se usa para el backend y la base de datos PostgreSQL porque es simple de configurar, gratuito y permite tener todo el backend en un solo lugar.

### PWA + Service Worker
Flowness está diseñado como una Aplicación Web Progresiva (PWA). Esto significa que el sitio puede instalarse en el celular como si fuera una app nativa y funcionar sin conexión a internet. Esto es fundamental para Flowness porque apunta a usuarios de todo el país, incluyendo zonas rurales de Catamarca con conectividad limitada. Mediante el Service Worker, el sitio guarda en el dispositivo el contenido que ya fue visitado, permitiendo que el usuario pueda seguir navegando aunque pierda la señal.

---

