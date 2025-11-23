// ===== LÓGICA DEL MENÚ DESPLEGABLE =====
document.addEventListener('DOMContentLoaded', function () {
    const userIcon = document.getElementById('userIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', function (e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Verificar estado de autenticación REAL
    checkAuthStatus();
});

// Función para verificar autenticación REAL
function checkAuthStatus() {
    const loginLink = document.getElementById('loginLink');
    const adminCuentaLink = document.getElementById('adminCuentaLink');
    const subirProyectoLink = document.getElementById('subirProyectoLink');
    const logoutLink = document.getElementById('logoutLink');
    const userIconText = document.getElementById('userIconText');
    const navMisProyectosLink = document.getElementById('navMisProyectosLink');
    
    // Verificar autenticación REAL desde localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        // Usuario LOGUEADO
        try {
            const user = JSON.parse(userData);
            if (loginLink) loginLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'block';
            if (adminCuentaLink) adminCuentaLink.style.display = 'block';
            if (subirProyectoLink) subirProyectoLink.style.display = 'block';
            if (userIconText) userIconText.textContent = user.name || 'Mi Cuenta';
            if (navMisProyectosLink) navMisProyectosLink.style.display = 'block';
        } catch (e) {
            console.error('Error parsing user data:', e);
            // Si hay error, tratar como no logueado
            setLoggedOutState();
        }
    } else {
        // Usuario NO logueado
        setLoggedOutState();
    }

    // Configurar evento de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            window.location.href = '../INDEX.html';
        });
    }
}

function setLoggedOutState() {
    const loginLink = document.getElementById('loginLink');
    const adminCuentaLink = document.getElementById('adminCuentaLink');
    const subirProyectoLink = document.getElementById('subirProyectoLink');
    const logoutLink = document.getElementById('logoutLink');
    const userIconText = document.getElementById('userIconText');
    const navMisProyectosLink = document.getElementById('navMisProyectosLink');
    
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (adminCuentaLink) adminCuentaLink.style.display = 'none';
    if (subirProyectoLink) subirProyectoLink.style.display = 'none';
    if (userIconText) userIconText.textContent = 'Iniciar Sesión';
    if (navMisProyectosLink) navMisProyectosLink.style.display = 'none';
}

// ===== LÓGICA DE PESTAÑAS =====
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Ocultar todo el contenido de pestañas
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // Quitar clase "active" de todos los botones
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Mostrar pestaña actual
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Mostrar primera pestaña por defecto
document.addEventListener("DOMContentLoaded", function () {
    const activeTab = document.querySelector('.tab-content.active');
    const allTabs = document.querySelectorAll('.tab-content:not(.active)');

    allTabs.forEach(tab => {
        tab.style.display = "none";
    });
    
    if (activeTab) {
        activeTab.style.display = "block";
    }
});