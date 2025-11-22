// rolChecker.js - Verificador simple de roles
console.log('✅ rolChecker.js cargado');

function checkUserRole() {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    
    console.log('🔍 Verificando rol:', userRole);
    
    if (!token) {
        console.log('❌ No autenticado');
        return null;
    }
    
    return userRole;
}

function isArchitect() {
    const role = checkUserRole();
    return role === 'arquitecto';
}

function isClient() {
    const role = checkUserRole();
    return role === 'cliente';
}

// Hacer las funciones disponibles globalmente
window.checkUserRole = checkUserRole;
window.isArchitect = isArchitect;
window.isClient = isClient;