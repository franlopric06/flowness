# 02 — Arquitectura de la Información

---

## Mapa del Sitio (Sitemap)

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

## Flujos de Usuario (User Flow)

### Flujo 1: Comprar un curso

```
[Inicio]
    ↓
[Ver catálogo de cursos]
    ↓
[Ver página del curso]
    ↓
[¿Tiene cuenta?]
   ↙          ↘
[No]          [Sí]
[Registro]    [Login]
   ↘          ↙
[Confirmar compra]
    ↓
[Acceso habilitado al curso ✓]
```

### Flujo 2: Reservar una clase

```
[Inicio]
    ↓
[Ver clases online]
    ↓
[Ver horarios disponibles]
    ↓
[Elegir día y horario]
    ↓
[¿Tiene cuenta?]
   ↙          ↘
[No]          [Sí]
[Registro]    [Login]
   ↘          ↙
[Confirmar reserva]
    ↓
[Confirmación por pantalla ✓]
```

> Ver diagramas visuales completos en Figma:
> https://www.figma.com/design/cTGOwbukaB7mQfRIttqhRu/