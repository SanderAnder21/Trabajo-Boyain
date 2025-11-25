# 🏗️ PortArq - Plataforma para Arquitectos

Plataforma web especializada para exposición, organización y gestión de proyectos arquitectónicos.

---

## 🚀 Configuración Inicial para Nuevos Desarrolladores

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Trabajo-Boyain
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

**IMPORTANTE:** El archivo `.env` NO está en el repositorio por seguridad.

```bash
# Copiar el template
cp .env.example .env
```

Luego **edita el archivo `.env`** con tus propias credenciales:

```env
# .env
OPENROUTER_API_KEY=tu_api_key_de_openrouter
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_de_mysql
DB_NAME=plataforma_arquitectos
DB_PORT=3306
JWT_SECRET=genera_un_string_aleatorio_muy_largo
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Dónde obtener las credenciales:**
- **OPENROUTER_API_KEY**: Pide la key al líder del equipo o genera una en https://openrouter.ai/keys
- **DB_PASSWORD**: Tu contraseña local de MySQL
- **JWT_SECRET**: Genera uno con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 4. Configurar la Base de Datos

```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE plataforma_arquitectos;
exit;
```

El servidor creará las tablas automáticamente al iniciar.

### 5. Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# O modo normal
npm start
```

El servidor estará disponible en: http://localhost:3000

---

## 📁 Estructura del Proyecto

```
Trabajo-Boyain/
├── HTML/              # Páginas HTML
├── CSS/               # Hojas de estilo
├── JS/                # JavaScript del frontend
│   ├── controllers/   # Controladores OOP
│   └── services/      # Servicios compartidos
├── src/               # Backend Node.js
│   ├── controllers/   # Lógica de negocio
│   ├── routes/        # Definición de rutas
│   └── middlewares/   # Autenticación, uploads
├── IMG/               # Imágenes y archivos
├── database.js        # Conexión a BD
├── app.js             # Entry point
└── .env               # Variables de entorno (NO en repo)
```

---

## 🔧 Scripts Disponibles

```bash
npm start          # Inicia el servidor
npm run dev        # Modo desarrollo con nodemon
npm test           # Ejecuta tests (pendiente)
```

---

## 🌐 Endpoints Principales

### Autenticación
- `POST /api/register` - Registrar usuario
- `POST /api/login` - Iniciar sesión

### Proyectos
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Ver proyecto
- `POST /api/projects` - Crear proyecto (requiere auth)
- `PUT /api/projects/:id` - Actualizar proyecto (requiere auth)
- `DELETE /api/projects/:id` - Eliminar proyecto (requiere auth)

### Favoritos
- `GET /api/favorites` - Listar favoritos
- `POST /api/favorites/:id` - Agregar favorito
- `DELETE /api/favorites/:id` - Eliminar favorito

### Calificaciones
- `POST /api/ratings/:projectId` - Calificar proyecto
- `GET /api/ratings/:projectId` - Ver calificación

---

## 📚 Documentación Adicional

- **Manual Completo**: Ver `MANUAL_PROYECTO.md` para documentación detallada
- **API Docs**: (Pendiente - Swagger)

---

## 🔒 Seguridad

### Archivos que NUNCA deben subirse al repositorio:

- `.env` - Variables de entorno
- `node_modules/` - Dependencias
- Archivos con credenciales o API keys

Estos están protegidos por `.gitignore`

### Si accidentalmente subes credenciales:

1. Revoca inmediatamente las credenciales expuestas
2. Genera nuevas credenciales
3. Actualiza tu `.env` local
4. Notifica al equipo

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la BD `plataforma_arquitectos` existe

### Error: "Port 3000 already in use"
- Cambia el `PORT` en `.env` a otro número (ej: 3001)
- O detén el proceso que usa el puerto 3000

### Error: "Module not found"
- Ejecuta `npm install` nuevamente
- Verifica que `node_modules/` exista

### Error: "JWT secret not defined"
- Asegúrate de tener `JWT_SECRET` en tu `.env`
- Genera uno con el comando mencionado arriba

---

## 👥 Equipo

**Frontend:**
- [Tu nombre]

**Backend:**
- [Nombres de tus compañeros]

---

## 📝 Flujo de Trabajo con Git

### Al empezar a trabajar:

```bash
git pull origin main
```

### Al terminar tu trabajo:

```bash
git add .
git commit -m "Descripción clara de los cambios"
git push origin main
```

### Buenas prácticas:

- ✅ Commits descriptivos en español
- ✅ Pull antes de push para evitar conflictos
- ✅ Probar localmente antes de hacer push
- ❌ NUNCA subir archivos `.env`
- ❌ NUNCA subir `node_modules/`

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa `MANUAL_PROYECTO.md` para documentación completa
2. Pregunta en el grupo del equipo
3. Revisa los issues en GitHub

---

## 📄 Licencia

[Especificar licencia del proyecto]

---

**Última actualización:** 24 de Noviembre, 2025