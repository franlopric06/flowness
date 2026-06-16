# 05 — Escalabilidad

---

## Bloque A — Escalabilidad de Carga y Tráfico

### ¿Cuánta gente va a entrar al sitio?

Flowness es un emprendimiento nuevo, por lo que al principio se espera una cantidad moderada de visitantes. Los momentos donde más gente va a entrar al mismo tiempo son cuando publique algo nuevo en su Instagram, como el lanzamiento de un curso o una promoción. En esos momentos se estima que pueden entrar entre 50 y 100 personas al mismo tiempo. El sitio está preparado para manejar eso sin problemas gracias a Vercel, que distribuye el contenido automáticamente sin importar cuánta gente entre.

### ¿Cómo funciona el servidor cuando entran muchos usuarios a la vez?

Se eligió Node.js como tecnología de backend porque utiliza un modelo de I/O No Bloqueante y Asíncrono. Esto significa que el servidor no se queda esperando que termine una operación para atender la siguiente, sino que puede manejar miles de peticiones al mismo tiempo de forma eficiente. Mientras espera la respuesta de la base de datos para un usuario, sigue procesando las peticiones de los demás sin bloquearse.
Este modelo es el más adecuado para Flowness porque las operaciones predominantes del sitio son de lectura y escritura en la base de datos: usuarios consultando el catálogo de cursos, realizando compras, accediendo a videos o reservando clases. A diferencia del modelo bloqueante tradicional donde cada petición ocupa un hilo del servidor hasta completarse, Node.js gestiona todas estas operaciones con un solo hilo de ejecución, lo que lo hace mucho más eficiente en este tipo de aplicaciones.

### ¿Cómo sabe el servidor quién está conectado?

El servidor no guarda en memoria quién está conectado. En cambio, cuando un usuario inicia sesión, el servidor le entrega una especie de "pase digital" llamado JWT. Ese pase queda guardado en el dispositivo del usuario y lo presenta cada vez que hace algo en el sitio, como ver un video o comprar un curso. De esta forma el servidor puede verificar quién es sin necesidad de recordarlo, lo cual hace que el sistema sea más liviano y fácil de hacer crecer en el futuro.

### ¿Para qué usamos Redis?

Redis funciona como una memoria de acceso rápido. Cuando muchas personas consultan el catálogo de cursos al mismo tiempo, en lugar de ir a buscar esa información a la base de datos principal cada vez, el sistema la guarda temporalmente en Redis y la entrega desde ahí. Esto hace que el sitio responda más rápido y que la base de datos principal no se sobrecargue con consultas repetidas.

---

## Bloque B — Escalabilidad de Datos y Teorema CAP

### ¿Qué tipo de datos tiene Flowness y por qué elegimos PostgreSQL?

Los datos de Flowness son altamente estructurados y tienen relaciones claras entre sí. Por ejemplo, un usuario puede tener varias compras, cada compra está relacionada con un curso, y cada curso tiene sus videos. Esta estructura ordenada es exactamente para lo que fue diseñado PostgreSQL. Además, cuando alguien compra un curso, es fundamental que esa transacción se registre correctamente o no se registre en absoluto, sin datos a medias. 

### ¿El sistema prioriza Consistencia o Disponibilidad?

Para entender esto hay que saber que el Teorema CAP dice que en un sistema web no se pueden garantizar al mismo tiempo la Consistencia (que todos vean los mismos datos), la Disponibilidad (que el sitio siempre responda) y la Tolerancia a Particiones (que el sistema siga funcionando aunque haya problemas de red). Como la red siempre puede fallar, la Tolerancia a Particiones es obligatoria, entonces hay que elegir entre Consistencia o Disponibilidad.Para Flowness se eligió CP (Consistencia + Tolerancia a Particiones). La razón es simple: si alguien paga por un curso y el sistema no registra correctamente esa compra, esa persona pierde el acceso al contenido que pagó y Flor pierde dinero. Ese error sería muy grave para el negocio. Por eso es más importante que los datos sean siempre correctos y consistentes, aunque en algún momento muy puntual el sitio tarde un poco más en responder.


### ¿Cómo crece la base de datos en 5 años?

Si Flowness crece y la base de datos llega a tener millones de registros en 5 años, se aplicarán estas estrategias para mantener las consultas rápidas:

- **Índices:** se agregarán en los campos más consultados, como el ID de usuario o el ID de curso, para que las búsquedas sean más rápidas sin recorrer toda la tabla.
- **Replicación:** se creará una copia de la base de datos para distribuir la carga entre lectura y escritura.
- **Redis como capa de caché:** los datos consultados frecuentemente se seguirán sirviendo desde Redis, reduciendo la cantidad de consultas directas a PostgreSQL.

---

## Bloque C — Justificación del Stack y Contexto Local

### ¿Qué modelo arquitectónico elegimos y por qué?

Se eligió el **Stack B — Asíncrono de Alta Concurrencia**. Este modelo está pensado para aplicaciones donde muchos usuarios interactúan al mismo tiempo con el sistema, consultando información, comprando productos o accediendo a contenido. Flowness encaja perfectamente en este perfil porque es una plataforma de venta y consumo de cursos online.

Se descartó el Stack A (Monolito Robusto con Java o C#) porque es más complejo de desarrollar y mantener, y está pensado para sistemas empresariales grandes como bancos o ERPs. También se descartó el Stack C (Jamstack) porque ese modelo es ideal para sitios de contenido estático, pero Flowness necesita un backend dinámico que gestione usuarios, compras, videos protegidos y un panel de administración.

### ¿Por qué este stack es el ideal para Tinogasta?

- **Conectividad limitada:** en zonas rurales de Catamarca la conexión puede ser lenta o inestable. Por eso Flowness está diseñado como PWA, permitiendo que el sitio funcione sin conexión o con señal débil.
- **Emprendimiento en crecimiento:** todo el stack es gratuito y de código abierto, sin costos de licencias. Vercel y Railway ofrecen planes gratuitos suficientes para la etapa inicial.
- **Mantenimiento local:** React, Node.js y PostgreSQL son las tecnologías más enseñadas en carreras de desarrollo de software en Argentina. Si el usuario necesita contratar a alguien local para mantener el sitio, va a encontrar fácilmente desarrolladores que conozcan estas tecnologías.
- **Estacionalidad:** Tinogasta recibe turismo en temporadas específicas. Si Flowness lanza campañas dirigidas a turistas, el sistema puede manejar picos de tráfico gracias al diseño stateless con JWT y el caching con Redis.

---
