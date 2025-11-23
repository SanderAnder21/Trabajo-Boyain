// JS/AdministrarCuentas.js

// JS/AdministrarCuentas.js - VERSIÓN CORREGIDA

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    let userRole = localStorage.getItem('userRole') || 'cliente';
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = localStorage.getItem('userId');
    
    // 1. Aplicar clase al body PRIMERO
    document.body.className = userRole;
    console.log('🎯 Rol aplicado al body:', userRole);
    
    // 2. Verificar autenticación
    if (!token || !userId) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = 'IniciarSesion.html';
        return;
    }

    // 3. Configurar navegación inicial (SOLO navegación, no visibilidad)
    if (userRole !== 'arquitecto') {
        handleClientNavigation(); // Solo maneja navegación, no visibilidad
    }

    // 4. Configurar resto de funcionalidades
    loadUserData(userData, userRole);
    setupFormHandlers(token, userRole);
    setupNavigation(); // ← AGREGAR esta función
    setupDropdown();   // ← AGREGAR esta función

    console.log('✅ AdministrarCuentas.js cargado correctamente');
});


function handleClientNavigation() {
    // SOLO manejar navegación, NO visibilidad (el CSS lo hace)
    const activeSection = document.querySelector('.admin-section.active');
    
    if (activeSection && activeSection.classList.contains('architect-only')) {
        switchToSection('personal');
    }

    const activeLink = document.querySelector('.sidebar-nav .nav-link.active');
    if (activeLink) {
        const section = activeLink.getAttribute('data-section');
        if (section && document.getElementById(section).classList.contains('architect-only')) {
            switchToSection('personal');
        }
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remover active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Agregar active al clickeado
            this.classList.add('active');
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

function setupDropdown() {
    const userIcon = document.getElementById('userIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (userIcon && dropdownMenu) {
        userIcon.addEventListener('click', function (e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        window.addEventListener('click', function (e) {
            if (!userIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

function switchToSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection && targetLink) {
        targetSection.classList.add('active');
        targetLink.classList.add('active');
    }
}

function loadUserData(userData, userRole) {
    if (document.getElementById('nombre')) {
        document.getElementById('nombre').value = userData.nombre || '';
    }
    if (document.getElementById('email')) {
        document.getElementById('email').value = userData.email || '';
    }
    if (document.getElementById('bio')) {
        document.getElementById('bio').value = userData.biografia || '';
    }

    if (userRole === 'arquitecto') {
        if (document.getElementById('telefono')) {
            document.getElementById('telefono').value = userData.telefono || '';
        }
        if (document.getElementById('estado')) {
            document.getElementById('estado').value = userData.ubicacion || '';
        }
    }
}

function setupFormHandlers(token, userRole) {
    const personalForm = document.querySelector('.personal-form');
    if (personalForm) {
        personalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await updatePersonalData(this, token);
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm && userRole === 'arquitecto') {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await updateContactData(this, token);
        });
    }

    const securityForm = document.querySelector('.security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await updateSecurityData(this, token);
        });
    }

    const profileInput = document.getElementById('profilePictureInput');
    const profilePreview = document.getElementById('profilePicturePreview');

    if (profileInput && profilePreview) {
        profileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Validar tipo y tamaño
                if (!file.type.startsWith('image/')) {
                    alert('Por favor selecciona una imagen válida');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB
                    alert('La imagen no debe superar los 5MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                };
                reader.onerror = function() {
                    alert('Error al leer la imagen');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

async function updatePersonalData(form, token) {
    try {
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            bio: formData.get('bio')
        };

        const response = await fetch('/api/user/personal', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Datos personales actualizados exitosamente');
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.nombre = data.nombre;
            userData.biografia = data.bio;
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar datos personales');
    }
}

async function updateContactData(form, token) {
    try {
        const formData = new FormData(form);
        const data = {
            telefono: formData.get('telefono'),
            estado: formData.get('estado')
        };

        const response = await fetch('/api/user/contact', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Datos de contacto actualizados exitosamente');
        } else if (response.status === 403) {
            alert('No tienes permisos para actualizar datos de contacto');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar datos de contacto');
    }
}

async function updateSecurityData(form, token) {
    try {
        const formData = new FormData(form);
        const data = {
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
        };

        if (data.newPassword !== data.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const response = await fetch('/api/user/security', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Contraseña actualizada exitosamente');
            form.reset();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar contraseña');
    }
}