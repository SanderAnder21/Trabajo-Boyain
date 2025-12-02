# Análisis del Proyecto PortArq (Contexto Escolar)

## 1. Visión General del Proyecto
**PortArq** es una plataforma web diseñada para que arquitectos y estudiantes de arquitectura puedan exhibir sus portafolios, compartir proyectos y conectar con la comunidad. El sistema permite la gestión de usuarios, publicación de proyectos con contenido multimedia, interacción social (favoritos, calificaciones, comentarios) y búsqueda avanzada.

## 2. Estructura del Proyecto
El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** adaptada para una aplicación web moderna con separación entre Backend (API REST) y Frontend (Cliente).

### Árbol de Directorios Principal
```
Trabajo-Boyain/
├── HTML/                   # Vistas (Interfaz de Usuario)
│   ├── INDEX.html          # Página de aterrizaje
│   ├── Proyectos.html      # Galería principal
│   ├── ProyectoDetalle.html # Vista individual de proyecto
│   ├── MisProyectos.html   # Panel de gestión del usuario
│   ├── SobreNosotros.html  # Información institucional
│   └── ... (Login, Registro, etc.)
│
├── CSS/                    # Estilos
│   ├── index.css           # Estilos base y variables globales
│   └── ... (Estilos específicos por página)
│
├── JS/                     # Lógica del Frontend (Cliente)
│   ├── controllers/        # Controladores de página (Lógica de UI)
│   │   ├── ProjectDetailController.js
│   │   ├── FavoritesController.js
│   │   └── ...
│   ├── services/           # Servicios reutilizables (Comunicación con API)
│   │   ├── AuthService.js  # Gestión de tokens y sesiones
│   │   ├── DataService.js  # Peticiones de datos generales
│   │   └── UIService.js    # Utilidades de interfaz (alertas, dropdowns)
│   ├── models/             # Modelos de datos en frontend
│   └── ... (Scripts de entrada)
│
├── src/                    # Lógica del Backend (Servidor Node.js)
│   ├── config/             # Configuración (BD, Claves secretas)
│   ├── controllers/        # Controladores de API (Lógica de negocio)
│   │   ├── AuthController.js
│   │   ├── ProjectController.js
│   │   ├── FavoriteController.js
│   │   └── RatingController.js
│   ├── routes/             # Definición de rutas (Endpoints API)
│   ├── middleware/         # Intermediarios (Autenticación, Logs)
│   └── Server.js           # Punto de entrada del servidor Express
│
├── IMG/                    # Recursos gráficos estáticos
├── database.js             # Clase de conexión y gestión de MySQL
└── app.js                  # Script de inicio principal
```

## 3. Ubicación de las Funciones Clave

### Backend (API & Base de Datos)
Aquí reside la lógica "dura", seguridad y acceso a datos.
*   **Autenticación:** `src/controllers/AuthController.js` (Login, Registro, JWT).
*   **Gestión de Proyectos:** `src/controllers/ProjectController.js` (Crear, Leer, Actualizar, Borrar).
*   **Favoritos:** `src/controllers/FavoriteController.js`.
*   **Calificaciones:** `src/controllers/RatingController.js`.
*   **Base de Datos:** `database.js` contiene todas las consultas SQL directas.

### Frontend (Interfaz & Experiencia)
Aquí reside la interactividad y la presentación.
*   **Lógica de Páginas:** Cada página HTML tiene un controlador asociado en `JS/controllers/` (ej. `Proyectos.html` usa `ProjectsGalleryController.js`).
*   **Comunicación con Backend:** `JS/services/AuthService.js` y `fetch` calls dentro de los controladores.
*   **Componentes UI:** `JS/services/UIService.js` maneja elementos comunes como el menú de usuario y alertas.

## 4. Estado de Implementación

### ✅ Funcionalidades Completadas
1.  **Autenticación:** Registro e inicio de sesión seguros con JWT.
2.  **Gestión de Proyectos (CRUD):**
    *   Subida de proyectos (con URLs de imágenes).
    *   Galería pública con filtros (búsqueda, categoría, orden).
    *   Detalle de proyecto completo.
3.  **Interacción Social:**
    *   Sistema de Favoritos (Guardar proyectos).
    *   Sistema de Calificaciones (Estrellas 1-5) y Comentarios.
4.  **Páginas Informativas:** Inicio, Sobre Nosotros.
5.  **Navegación:** Menú responsivo y dropdown de usuario.

## 5. Análisis de Faltantes (Contexto Escolar)

Para presentar este proyecto como un trabajo escolar completo y profesional, se recomiendan las siguientes implementaciones pendientes, ordenadas por prioridad:

### 🔴 Prioridad Alta (Esencial para una buena calificación)
1.  **Edición de Perfil:**
    *   *Falta:* Conectar el formulario de `AdministrarCuenta.html` con el backend para permitir al usuario cambiar su nombre, avatar, biografía y contraseña.
    *   *Por qué:* Es una funcionalidad básica esperada en cualquier sistema de usuarios.
2.  **Edición y Borrado de Proyectos (Frontend):**
    *   *Falta:* Botones en "Mis Proyectos" para editar o eliminar un proyecto propio. El backend ya existe, falta la interfaz.
    *   *Por qué:* Completa el ciclo CRUD que suelen evaluar los profesores.
3.  **Formulario de Contacto Funcional:**
    *   *Falta:* Hacer que el formulario en `Contactanos.html` envíe los datos al backend (guardar en BD o simular envío).
    *   *Por qué:* Una página de contacto estática se ve incompleta.

### 🟡 Prioridad Media (Mejoras Técnicas Valiosas)
4.  **Carga Real de Archivos (File Upload):**
    *   *Situación:* Actualmente se piden URLs de imágenes.
    *   *Mejora:* Implementar `multer` en el backend para permitir subir archivos `.jpg`, `.png`, `.pdf` reales al servidor.
    *   *Por qué:* Demuestra dominio técnico sobre manejo de archivos, un requisito común en proyectos avanzados.
5.  **Validaciones de Formulario Robustas:**
    *   *Mejora:* Feedback visual inmediato si un campo es inválido (ej. email mal formado, contraseña corta).

### 🟢 Prioridad Baja (Plus / Deseable)
6.  **Panel de Administración (Dashboard):**
    *   Vista para un usuario "Admin" que pueda moderar comentarios o borrar usuarios.
7.  **Recuperación de Contraseña:**
    *   Flujo de "Olvidé mi contraseña".

## 6. Recomendación Inmediata
Concentrarse en **conectar la Edición de Perfil** y habilitar los botones de **Editar/Borrar en Mis Proyectos**. Con eso, el sistema será funcionalmente redondo para una entrega escolar.
