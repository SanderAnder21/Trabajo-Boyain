// JS/rolChecker.js - Lógica de control de roles y autenticación (VERSIÓN FINAL CON DETECCIÓN DE URL)

document.addEventListener('DOMContentLoaded', () => {
    // Leer el estado del usuario desde localStorage
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    // --- Elementos de Navegación (Buscar en toda la página) ---
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const navMisProyectosLink = document.getElementById('navMisProyectosLink');
    const subirProyectoLink = document.getElementById('subirProyectoLink');
    const adminCuentaLink = document.getElementById('adminCuentaLink');
    const userIconText = document.getElementById('userIconText'); 

    // --- Elementos de MisProyectos.html (Pestañas) ---
    const tabPublicadosButton = document.getElementById('tabPublicadosButton');
    const publicadosContent = document.getElementById('publicados');
    const guardadosButton = document.getElementById('guardadosButton');
    
    // --- IDENTIFICACIÓN ROBUSTA DE PÁGINAS (Usando la URL) ---
    // Obtenemos el nombre del archivo en minúsculas para robustez.
    const currentFileName = window.location.pathname.split('/').pop().toLowerCase();
    
    // Identificación de Páginas Protegidas
    const isMisProyectosPage = currentFileName === 'misproyectos.html';
    const isSubirProyectoPage = currentFileName === 'subirproyecto.html';
    // ⭐ CLAVE: Detecta si el nombre del archivo actual es iniciarsesion.html ⭐
    const isIniciarSesionPage = currentFileName === 'iniciarsesion.html';
    const isCrearCuentaPage = currentFileName === 'crearcuenta.html';


    // 1. GESTIÓN DE AUTENTICACIÓN
    if (userRole) {
        // Usuario Logueado
        if (loginLink) loginLink.style.display = 'none';
        
        // ⭐ EXCEPCIÓN: Si ya estás logueado y tratas de entrar a Login/Registro, redirige a Inicio. (CORRECTO)
        if (isIniciarSesionPage || isCrearCuentaPage) {
            window.location.href = '../INDEX.html'; 
            return; 
        }

        if (logoutLink) {
            logoutLink.style.display = 'block';
            logoutLink.addEventListener('click', handleLogout); 
        }
        if (adminCuentaLink) adminCuentaLink.style.display = 'block';
        
        if (userIconText && userName) {
             userIconText.textContent = userName;
        }

        // 2. GESTIÓN DE ROLES (DUALIDAD)
        // ... (Tu lógica de roles 'arquitecto' y 'cliente' sigue aquí, sin cambios) ...
        if (userRole === 'arquitecto') {
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'block';
            if (subirProyectoLink) subirProyectoLink.style.display = 'block';
            if (isMisProyectosPage && tabPublicadosButton) {
                tabPublicadosButton.style.display = 'inline-block';
            }
        } else { // Rol 'cliente'
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
            if (subirProyectoLink) subirProyectoLink.style.display = 'none';
            
            if (isSubirProyectoPage) {
                alert('Acceso denegado. Solo los arquitectos pueden administrar proyectos.');
                window.location.href = '../INDEX.html'; 
                return;
            }
            // ... (Lógica de MisProyectos para Clientes) ...
        }

    } else {
        // Usuario Invitado: Ocultar todo lo de gestión
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
        if (subirProyectoLink) subirProyectoLink.style.display = 'none';
        if (adminCuentaLink) adminCuentaLink.style.display = 'none';

        // ⭐ SOLUCIÓN CLAVE: Si NO estás logueado, solo redirige si la página NO es de autenticación.
        const isAuthPage = isIniciarSesionPage || isCrearCuentaPage; 

        if ((isMisProyectosPage || isSubirProyectoPage) && !isAuthPage) {
            alert('Debes iniciar sesión para acceder a esta sección.');
            window.location.href = '../INDEX.html'; 
            return;
        }
    }
});

// Función para limpiar la sesión (Cerrar Sesión)
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    alert('Sesión cerrada exitosamente.');
    window.location.reload(); 
}