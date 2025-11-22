// JS/AdministrarCuentas.js

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el rol de usuario almacenado en el inicio de sesión
    const userRole = localStorage.getItem('userRole');
    
    // Si el rol es 'arquitecto', mostramos las secciones ocultas
    if (userRole === 'arquitecto') {
        const architectElements = document.querySelectorAll('.architect-only');
        
        architectElements.forEach(el => {
            // Remover la clase para que el CSS ya no oculte el elemento
            el.classList.remove('architect-only');
        });
        
    } else { // El rol es 'cliente' (o nulo/inválido), mantener restricciones
        
        // 1. Asegurar que la primera sección visible para el cliente sea 'Datos Personales'
        
        // Buscar si alguna de las secciones restringidas es la activa por defecto
        const activeSection = document.querySelector('.admin-section.active');
        
        if (activeSection && activeSection.classList.contains('architect-only')) {
            
            // Si la sección activa es restringida, desactivarla
            activeSection.classList.remove('active');
            
            // Activar la sección 'personal'
            const personalSection = document.getElementById('personal');
            if(personalSection) {
                personalSection.classList.add('active');
            }
            
            // Corregir también el enlace del menú lateral activo
            const activeLink = document.querySelector('.sidebar-nav .nav-link.active');
            if(activeLink) {
                activeLink.classList.remove('active');
            }
            
            const personalLink = document.querySelector('[data-section="personal"]');
            if(personalLink) {
                personalLink.classList.add('active');
            }
        }
    }
    
    // Si necesitas más lógica de interacción específica de Administrar Cuentas, añádela aquí.
    
});