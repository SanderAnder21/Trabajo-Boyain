// JS/rolChecker.js - Lógica de control de roles y autenticación (Versión Final)

document.addEventListener('DOMContentLoaded', () => {
    // Leer el estado del usuario desde localStorage
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    // --- Elementos de Navegación (Buscar en toda la página) ---
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const navMisProyectosLink = document.getElementById('navMisProyectosLink'); // Enlace principal de Mis Proyectos
    const subirProyectoLink = document.getElementById('subirProyectoLink'); // Enlace dentro del dropdown
    const adminCuentaLink = document.getElementById('adminCuentaLink'); // Enlace Mi Cuenta
    const userIconText = document.getElementById('userIconText'); 

    // --- Elementos de MisProyectos.html (Pestañas) ---
    const tabPublicadosButton = document.getElementById('tabPublicadosButton');
    const publicadosContent = document.getElementById('publicados');
    const guardadosButton = document.getElementById('guardadosButton');
    
    // --- Identificación de Páginas Protegidas ---
    const isMisProyectosPage = document.title.includes('Mis Proyectos');
    const isSubirProyectoPage = document.title.includes('Subir Proyecto');


    // 1. GESTIÓN DE AUTENTICACIÓN
    if (userRole) {
        // Usuario Logueado
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) {
            logoutLink.style.display = 'block';
            logoutLink.addEventListener('click', handleLogout); 
        }
        if (adminCuentaLink) adminCuentaLink.style.display = 'block';
        
        // Mostrar el nombre del usuario
        if (userIconText && userName) {
             userIconText.textContent = userName;
        }

        // 2. GESTIÓN DE ROLES (DUALIDAD)
        if (userRole === 'arquitecto') {
            // ARQUITECTO: Puede ver todas las opciones de gestión
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'block';
            if (subirProyectoLink) subirProyectoLink.style.display = 'block';
            
            // Lógica en MisProyectos.html (mostrar Publicados)
            if (isMisProyectosPage && tabPublicadosButton) {
                tabPublicadosButton.style.display = 'inline-block';
            }

        } else { // Rol 'cliente'
            // CLIENTE: Ocultar todas las opciones de gestión
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
            if (subirProyectoLink) subirProyectoLink.style.display = 'none';
            
            // ⭐ RESTRICCIÓN DE PÁGINAS PROTEGIDAS (CLIENTE) ⭐
            if (isSubirProyectoPage) {
                alert('Acceso denegado. Solo los arquitectos pueden administrar proyectos.');
                window.location.href = '../INDEX.html'; 
                return; // Detener ejecución para evitar errores
            }
            
            // Lógica en MisProyectos.html (ocultar Publicados)
            if (isMisProyectosPage) {
                if (tabPublicadosButton) {
                    tabPublicadosButton.style.display = 'none';
                }
                // Si la pestaña 'publicados' está activa, cambiar a 'guardados'
                if (publicadosContent && guardadosButton && publicadosContent.classList.contains('active')) {
                    guardadosButton.click(); 
                }
            }
        }

    } else {
        // Usuario Invitado: Ocultar todo lo de gestión
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
        if (subirProyectoLink) subirProyectoLink.style.display = 'none';
        if (adminCuentaLink) adminCuentaLink.style.display = 'none';

        // ⭐ RESTRICCIÓN DE PÁGINAS PROTEGIDAS (INVITADO) ⭐
        if (isMisProyectosPage || isSubirProyectoPage) {
             alert('Debes iniciar sesión para acceder a esta sección.');
             window.location.href = '../INDEX.html'; 
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