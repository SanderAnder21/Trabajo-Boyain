import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import database from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración DIRECTA (elimina esto una vez que .env funcione)
const OPENAI_API_KEY = "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";
const OPENAI_BASE_URL = "https://openrouter.ai/api/v1";
const PORT = 3000;

console.log('🔑 Usando configuración directa');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inicializar base de datos
async function initializeDatabase() {
    try {
        await database.connect();
        await database.createTables();
        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error iniciando la base de datos:', error.message);
        process.exit(1);
    }
}

// Ruta para el chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'El mensaje es requerido' });
        }

        console.log('📨 Mensaje recibido:', message);

        const chat = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content: message }],
            max_tokens: 500
        });

        const botResponse = chat.choices[0].message.content;
        console.log('🤖 Respuesta del bot:', botResponse);
        
        res.json({ response: botResponse });
        
    } catch (error) {
        console.error("❌ Error en el chat:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor",
            details: error.message 
        });
    }
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password, tipoCuenta } = req.body;

        // 1. Validación básica de datos
        if (!nombre || !email || !password || !tipoCuenta) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }
        
        // 2. Mapear 'tipoCuenta' a booleano
        const esArquitecto = tipoCuenta === 'arquitecto';

        // 3. Registrar el usuario en la BD
        const userId = await database.registerUser(nombre, email, password, esArquitecto);

        console.log(`👤 Usuario registrado exitosamente con ID: ${userId}`);

        // 4. Respuesta exitosa
        res.status(201).json({ 
            message: '¡Cuenta creada exitosamente!', 
            userId: userId 
        });

    } catch (error) {
        // 5. Manejo de errores (ej. email duplicado)
        console.error("❌ Error al registrar usuario:", error.message);
        
        // El error personalizado que lanzamos desde database.js
        if (error.message.includes('email ya está registrado')) {
            return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ 
            error: "Error interno del servidor durante el registro.",
            details: error.message 
        });
    }
});

// Ruta para el inicio de sesión
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Faltan credenciales (email y password).' });
        }

        // 1. Buscar usuario por email
        const user = await database.findUserByEmail(email);

        if (!user) {
            // No se debe decir si falla el email o la contraseña, solo "Credenciales inválidas"
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 2. Comparar contraseña (password) enviada con el hash de la BD
        const match = await database.verifyPassword(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        console.log(`🔑 Login exitoso para el usuario: ${user.email}`);

        // 3. Respuesta exitosa (Se elimina la contraseña antes de enviar)
        const { password: _, ...userData } = user; 
        
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.', 
            ...userData 
        });

    } catch (error) {
        console.error("❌ Error en el inicio de sesión:", error.message);
        res.status(500).json({ 
            error: "Error interno del servidor.",
            details: error.message 
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'INDEX.html'));
});

// Iniciar servidor
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });
});