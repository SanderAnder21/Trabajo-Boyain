// JS/rolChecker3.js - VERSIÓN CORREGIDA Y SIMPLIFICADA

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== ROLCHECKER INICIADO ===');
    
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    console.log('Usuario:', userRole || 'Invitado');
    console.log('Página actual:', currentPage);

    // SOLO manejar la UI - NUNCA redirigir desde páginas públicas
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const navMisProyectosLink = document.getElementById('navMisProyectosLink');
    const subirProyectoLink = document.getElementById('subirProyectoLink');
    const adminCuentaLink = document.getElementById('adminCuentaLink');
    const userIconText = document.getElementById('userIconText');

    // USUARIO LOGUEADO
    if (userRole) {
        console.log('👤 Usuario logueado detectado');
        
        // Ocultar/Mostrar elementos
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) {
            logoutLink.style.display = 'block';
            logoutLink.addEventListener('click', handleLogout);
        }
        if (adminCuentaLink) adminCuentaLink.style.display = 'block';
        if (userIconText && userName) userIconText.textContent = userName;

        // Control por rol
        if (userRole === 'arquitecto') {
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'block';
            if (subirProyectoLink) subirProyectoLink.style.display = 'block';
        } else {
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'block';
            if (subirProyectoLink) subirProyectoLink.style.display = 'none';
        }

        // ⚠️ SOLO redirigir si está en páginas de auth Y ya está logueado
        if ((currentPage === 'iniciarsesion.html' || currentPage === 'crearcuenta.html') && userRole) {
            console.log('🔄 Redirigiendo a INDEX - Ya está logueado');
            setTimeout(() => {
                window.location.href = '../INDEX.html';
            }, 100);
        }

    } 
    // USUARIO INVITADO
    else {
        console.log('🎯 Usuario invitado');
        
        // Mostrar/Ocultar elementos
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
        if (subirProyectoLink) subirProyectoLink.style.display = 'none';
        if (adminCuentaLink) adminCuentaLink.style.display = 'none';

        // ⚠️ SOLO redirigir si intenta acceder a páginas protegidas
        if ((currentPage === 'misproyectos.html' || currentPage === 'subirproyecto.html') && !userRole) {
            console.log('🔄 Redirigiendo - Acceso denegado para invitado');
            setTimeout(() => {
                alert('Debes iniciar sesión para acceder a esta sección.');
                window.location.href = '../INDEX.html';
            }, 100);
        }
    }
    
    console.log('✅ ROLCHECKER COMPLETADO');
});

function handleLogout(e) {
    e.preventDefault();
    e.stopPropagation();
    
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    alert('Sesión cerrada exitosamente.');
    window.location.href = '../INDEX.html';
}