# Arquitectura del Proyecto - PortArq

## Resumen

Este documento describe la arquitectura orientada a objetos del proyecto PortArq, una plataforma para exposición, organización y gestión de proyectos para arquitectos.

## Estructura del Proyecto

```
Trabajo-Boyain/
├── src/                          # Código fuente del backend (Node.js)
│   ├── config/
│   │   └── config.js            # Configuración centralizada (Singleton)
│   ├── controllers/
│   │   ├── AuthController.js    # Controlador de autenticación
│   │   ├── UserController.js    # Controlador de usuarios
│   │   └── ChatController.js    # Controlador del chatbot
│   ├── middlewares/
│   │   └── AuthMiddleware.js    # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── AuthRoutes.js        # Rutas de autenticación
│   │   ├── UserRoutes.js        # Rutas de usuario
│   │   └── ChatRoutes.js        # Rutas del chatbot
│   ├── services/
│   │   └── OpenAIService.js     # Servicio para OpenAI API
│   └── Server.js                 # Clase principal del servidor
├── JS/                           # Código fuente del frontend
│   ├── controllers/
│   │   ├── LoginController.js   # Controlador de login
│   │   ├── RegistroController.js # Controlador de registro
│   │   ├── AdminPage.js         # Controlador de administración
│   │   ├── ProjectDetailController.js
│   │   ├── ProjectListPage.js
│   │   ├── ArchitectProfileController.js
│   │   └── UpdateProjectController.js
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Project.js           # Modelo de proyecto
│   │   └── Architect.js         # Modelo de arquitecto
│   ├── services/
│   │   ├── AuthService.js       # Servicio de autenticación
│   │   ├── DataService.js       # Servicio de datos
│   │   └── UIService.js         # Servicio de UI
│   └── components/
│       └── Chatbot.js           # Componente del chatbot
├── HTML/                         # Páginas HTML
├── CSS/                          # Hojas de estilo
├── IMG/                          # Imágenes
├── database.js                   # Clase Database (Singleton)
├── app.js                        # Punto de entrada de la aplicación
└── package.json                  # Dependencias del proyecto
```

## Patrón de Arquitectura

### Backend: MVC (Modelo-Vista-Controlador)

El backend sigue el patrón MVC adaptado para una API REST:

#### **Modelo** (`database.js`)
- **Clase `Database`**: Gestiona todas las operaciones de base de datos
- Implementa el patrón Singleton
- Métodos para CRUD de usuarios, proyectos, etc.
- Encapsula la lógica de MySQL

#### **Controlador** (`src/controllers/`)
- **`AuthController`**: Maneja registro, login y verificación de tokens
- **`UserController`**: Gestiona operaciones de perfil de usuario
- **`ChatController`**: Procesa mensajes del chatbot

#### **Vista** (JSON Responses)
- Las respuestas JSON actúan como "vistas" en una API REST
- El frontend consume estas respuestas

#### **Rutas** (`src/routes/`)
- **`AuthRoutes`**: Define endpoints de autenticación
- **`UserRoutes`**: Define endpoints de usuario
- **`ChatRoutes`**: Define endpoints del chatbot
- Cada clase de rutas encapsula un router de Express

### Frontend: MVC

#### **Modelo** (`JS/models/`)
- **`User`**: Representa un usuario (cliente o arquitecto)
- **`Project`**: Representa un proyecto arquitectónico
- **`Architect`**: Representa un arquitecto (extiende User)

#### **Vista** (HTML + CSS)
- Páginas HTML en la carpeta `HTML/`
- Estilos en la carpeta `CSS/`

#### **Controlador** (`JS/controllers/`)
- **`LoginController`**: Maneja el formulario de login
- **`RegistroController`**: Maneja el formulario de registro
- **`AdminPage`**: Gestiona la página de administración de cuenta
- Otros controladores para diferentes páginas

#### **Servicios** (`JS/services/`)
- **`AuthService`**: Encapsula la lógica de autenticación
- **`DataService`**: Maneja las llamadas a la API
- **`UIService`**: Gestiona interacciones de UI (alertas, redirecciones)

## Principios SOLID Aplicados

### 1. **Single Responsibility Principle (SRP)**
- Cada clase tiene una única responsabilidad:
  - `AuthController`: Solo autenticación
  - `UserController`: Solo gestión de usuarios
  - `Database`: Solo operaciones de BD

### 2. **Open/Closed Principle (OCP)**
- Las clases están abiertas para extensión pero cerradas para modificación
- Ejemplo: Se pueden agregar nuevos controladores sin modificar `Server.js`

### 3. **Liskov Substitution Principle (LSP)**
- Los controladores pueden ser reemplazados por implementaciones alternativas
- Ejemplo: `AuthService` podría tener diferentes implementaciones (JWT, OAuth, etc.)

### 4. **Interface Segregation Principle (ISP)**
- Los middlewares son específicos y no obligan a implementar métodos innecesarios
- Ejemplo: `requireArchitect` vs `requireClient`

### 5. **Dependency Inversion Principle (DIP)**
- Los controladores dependen de abstracciones (servicios) no de implementaciones concretas
- Ejemplo: `ChatController` depende de `OpenAIService`, no de la API directamente

## Patrones de Diseño Utilizados

### 1. **Singleton**
- **`Config`**: Una única instancia de configuración
- **`Database`**: Una única conexión a la base de datos
- **`AuthMiddleware`**: Una única instancia de middleware
- **Servicios**: `OpenAIService`, `AuthService`, etc.

### 2. **Factory**
- **`User.fromData()`**: Crea instancias de User desde datos planos

### 3. **Dependency Injection**
- Los controladores del frontend reciben servicios en el constructor
- Ejemplo: `AdminPage` recibe `authService`, `uiService`, `dataService`

### 4. **Middleware Pattern**
- **`AuthMiddleware`**: Intercepta requests para validar autenticación
- **Express middlewares**: CORS, body-parser, etc.

## Flujo de Datos

### Autenticación (Login)

```
[Usuario] → [LoginController] → [AuthService] 
    ↓
[API /api/login] → [AuthRoutes] → [AuthController]
    ↓
[Database.findUserByEmail()] → [MySQL]
    ↓
[AuthController.generateToken()] → [JWT]
    ↓
[Respuesta JSON] → [AuthService] → [LoginController]
    ↓
[Redirección según rol]
```

### Actualización de Perfil

```
[Usuario] → [AdminPage] → [DataService]
    ↓
[API /api/user/personal] → [UserRoutes] → [AuthMiddleware]
    ↓
[UserController] → [Database.updateUserPersonalData()]
    ↓
[MySQL] → [Respuesta] → [AdminPage] → [UI actualizada]
```

### Chatbot

```
[Usuario] → [Chatbot Component] → [API /api/chat]
    ↓
[ChatRoutes] → [ChatController] → [OpenAIService]
    ↓
[OpenAI API] → [Respuesta] → [Chatbot Component]
```

## Configuración

### Variables de Entorno

La clase `Config` centraliza todas las configuraciones:

```javascript
- PORT: Puerto del servidor (default: 3000)
- OPENAI_API_KEY: Clave de API de OpenAI
- OPENAI_BASE_URL: URL base de OpenAI
- OPENAI_MODEL: Modelo de OpenAI a usar
- JWT_SECRET: Clave secreta para JWT
- JWT_EXPIRATION: Tiempo de expiración del token
- DB_HOST: Host de MySQL
- DB_USER: Usuario de MySQL
- DB_PASSWORD: Contraseña de MySQL
- DB_NAME: Nombre de la base de datos
- CORS_ORIGIN: Origen permitido para CORS
```

## Base de Datos

### Esquema

#### Tabla `usuarios`
- `id`: INT (PK, AUTO_INCREMENT)
- `nombre`: VARCHAR(100)
- `email`: VARCHAR(100) UNIQUE
- `password`: VARCHAR(255) (hasheada con bcrypt)
- `es_arquitecto`: BOOLEAN
- `avatar`: VARCHAR(255)
- `biografia`: TEXT
- `especialidad`: VARCHAR(100)
- `titulacion`: VARCHAR(100)
- `telefono`: VARCHAR(20)
- `experiencia`: VARCHAR(50)
- `ubicacion`: VARCHAR(100)
- `suscripcion_activa`: BOOLEAN
- `fecha_registro`: DATETIME

#### Otras Tablas
- `proyectos`: Proyectos arquitectónicos
- `imagenes_proyecto`: Imágenes de proyectos
- `etiquetas`: Etiquetas técnicas y de estilo
- `proyecto_etiquetas`: Relación muchos a muchos
- `favoritos`: Proyectos favoritos de usuarios
- `calificaciones`: Calificaciones de proyectos

## Seguridad

### Autenticación
- **JWT (JSON Web Tokens)**: Para mantener sesiones
- **bcrypt**: Para hashear contraseñas (10 rounds)
- **Middleware de autenticación**: Valida tokens en rutas protegidas

### Autorización
- **Middleware de roles**: `requireArchitect`, `requireClient`
- Validación de permisos en el backend

### Validación
- Validación de datos en controladores
- Sanitización de inputs
- Manejo de errores centralizado

## Testing

Actualmente el proyecto no tiene tests automatizados. Se recomienda agregar:

- **Unit Tests**: Para modelos, servicios y controladores
- **Integration Tests**: Para rutas y endpoints
- **E2E Tests**: Para flujos completos de usuario

Herramientas sugeridas:
- **Jest**: Para unit e integration tests
- **Supertest**: Para testing de API
- **Cypress**: Para E2E tests

## Mejoras Futuras

1. **Implementar tests automatizados**
2. **Agregar logging estructurado** (Winston, Pino)
3. **Implementar rate limiting** para prevenir abuso
4. **Agregar validación de esquemas** (Joi, Yup)
5. **Implementar caché** (Redis) para mejorar performance
6. **Agregar documentación de API** (Swagger/OpenAPI)
7. **Implementar CI/CD** (GitHub Actions, Jenkins)
8. **Agregar monitoreo** (Prometheus, Grafana)

## Conclusión

El proyecto ahora sigue una arquitectura orientada a objetos completa, aplicando principios SOLID y patrones de diseño establecidos. La separación de responsabilidades facilita el mantenimiento, testing y escalabilidad del código.
