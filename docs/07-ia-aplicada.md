# 07 — IA Aplicada al Desarrollo

> [Volver al README principal](../README.md)

---

## Bitácora de Uso de IA

### Instancia 1 — Generación del componente Header con menú hamburguesa

**Herramienta:** Claude (Anthropic)

**Tarea delegada:** Crear el componente Header con navegación responsive, logo y menú hamburguesa para mobile.

**Prompt enviado:**
> "Creame el Header.jsx con Tailwind CSS mobile first. Tiene que tener el logo de Flowness, links de navegación ocultos en mobile y visibles en desktop, botón de ingresar y menú hamburguesa que aparece solo en mobile con useState."

**Resultado obtenido:**
La IA generó el componente completo con `useState` para manejar el estado del menú, clases de Tailwind mobile first y la lógica del hamburguesa funcionando correctamente.

**Revisiones realizadas:**
- Se ajustaron los colores para que coincidan con el manual de identidad de Flowness (#7B9B77, #D8A48F, #F5F0EB)
- Se reemplazaron los `<a href>` por `<Link>` de React Router
- Se agregó el logo real de Flowness reemplazando el texto
- Se ajustó el posicionamiento del logo para que quede centrado en mobile

---

### Instancia 2 — Generación del sistema de validación del formulario de contacto

**Herramienta:** Claude (Anthropic)

**Tarea delegada:** Agregar validación y sanitización al formulario de contacto para prevenir errores y ataques XSS.

**Prompt enviado:**
> "Agregá validación y sanitización al componente Contacto.jsx. Que valide nombre, email y mensaje, muestre errores en rojo, y sanitice los datos antes de enviarlos para prevenir XSS."

**Resultado obtenido:**
La IA generó el sistema completo con función `validar()` que verifica campos vacíos y formatos, función `sanitizar()` que escapa caracteres especiales HTML, manejo de errores por campo y mensaje de éxito al enviar.

**Revisiones realizadas:**
- Se verificó que la función `sanitizar()` cubra los caracteres más peligrosos (&, <, >, ", ')
- Se mantuvo la identidad visual de Flowness en los mensajes de error (color rojo suave)
- Se agregó el estado `enviado` para mostrar confirmación al usuario

---

### Instancia 3 — Configuración del SEO técnico

**Herramienta:** Claude (Anthropic)

**Tarea delegada:** Implementar SEO técnico completo incluyendo metadatos, Open Graph, JSON-LD, robots.txt y sitemap.xml.

**Prompt enviado:**
> "Ayudame a implementar SEO técnico para el proyecto Flowness en React. Necesito un componente SEO reutilizable con react-helmet-async que incluya title, meta description, Open Graph y canonical. También el JSON-LD para Schema.org, robots.txt y sitemap.xml."

**Resultado obtenido:**
La IA generó el componente SEO reutilizable, el bloque JSON-LD con schema EducationalOrganization, el robots.txt y el sitemap.xml completo con todas las rutas del proyecto.

**Revisiones realizadas:**
- Se verificó que el JSON-LD sea válido para Schema.org usando la herramienta de Google "Prueba de resultados enriquecidos"
- Se actualizaron las URLs con la URL real de producción de Vercel
- Se agregó la etiqueta canonical correcta en cada página

---

## Skills y Tool Calling

### ¿Qué es una Skill?

Una Skill es una capacidad o herramienta específica que se le puede dar a un agente de IA para que pueda interactuar con el mundo exterior. Por ejemplo, una Skill puede ser la capacidad de buscar en internet, ejecutar código, acceder a una base de datos o enviar un email. Sin Skills, la IA solo puede generar texto; con Skills, puede tomar acciones reales.

### Flujo técnico de 4 pasos

1. **Definición:** El desarrollador define la Skill describiendo qué hace, qué parámetros recibe y qué devuelve. Por ejemplo: "buscar_producto(nombre: string) → lista de productos".

2. **Intención:** El modelo de IA detecta en el mensaje del usuario que necesita usar esa Skill. Por ejemplo, si el usuario dice "buscame zapatillas Nike", el modelo detecta que debe usar la Skill de búsqueda.

3. **Argumento:** El modelo extrae los parámetros necesarios del mensaje del usuario y los prepara para llamar a la Skill. En el ejemplo, extrae "zapatillas Nike" como argumento.

4. **Ejecución:** El sistema ejecuta la Skill con los argumentos extraídos, obtiene el resultado y se lo devuelve al modelo para que lo incluya en su respuesta al usuario.

### Tres vectores de seguridad principales

1. **Inyección de prompts:** Un usuario malicioso puede intentar manipular los argumentos que se pasan a la Skill para que haga algo diferente a lo esperado. Por ejemplo, si la Skill busca productos, un usuario podría intentar inyectar comandos maliciosos en el nombre del producto.

2. **Escalada de privilegios:** La IA podría intentar usar una Skill con más permisos de los que debería tener. Es importante limitar qué puede hacer cada Skill y validar siempre los permisos antes de ejecutarla.

3. **Exfiltración de datos:** Una Skill con acceso a datos sensibles podría ser manipulada para devolver información que no debería ser pública. Es fundamental validar y filtrar los datos que devuelve cada Skill antes de mostrarlos al usuario.

---

## Reflexión crítica

Durante el desarrollo del proyecto Flowness, la Inteligencia Artificial fue una herramienta fundamental que cambió completamente mi forma de programar. Delegué tareas como la generación de componentes React con Tailwind CSS, la configuración del SEO técnico, la implementación de la validación del formulario y la estructuración de la documentación en Markdown. En todos estos casos, la IA funcionó como un punto de partida muy sólido que me ahorró horas de trabajo.

Sin embargo, el uso de IA también generó trabajo extra en varios aspectos. El código generado necesitaba ser adaptado al contexto específico del proyecto: los colores del manual de identidad de Flowness, la lógica de navegación con React Router, el ajuste del padding para que el header fijo no tapara el contenido. Ninguna de estas adaptaciones las hizo la IA por sí sola; requirieron mi comprensión del problema y mi criterio para resolverlo.

Lo que más cambió en mi forma de programar fue la velocidad con la que puedo generar una base de código funcional. Antes dedicaba mucho tiempo a recordar la sintaxis o buscar ejemplos; ahora puedo pedirle a la IA un componente y tener algo funcionando en minutos. Pero esto también me enseñó que entender el código es indispensable: si no entendés lo que la IA generó, no podés adaptarlo, depurarlo ni defenderlo en una exposición. La IA es una herramienta poderosa, pero el criterio técnico sigue siendo responsabilidad del desarrollador.