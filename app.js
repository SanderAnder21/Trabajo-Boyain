// app.js - Punto de entrada de la aplicación

import Server from './src/Server.js';

/**
 * Punto de entrada principal de la aplicación.
 * Crea una instancia del servidor y la inicia.
 */
const server = new Server();
server.start();