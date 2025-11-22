// JS/AdministrarCuentas.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = 'IniciarSesion.html';
        return;
    }

    if (userRole === 'arquitecto') {
        const architectElements = document.querySelectorAll('.architect-only');
        architectElements.forEach(el => {
            el.style.display = 'block';
        });
    } else {
        handleClientAccess();
    }

    loadUserData(userData, userRole);
    setupFormHandlers(token, userRole);

    console.log('✅ AdministrarCuentas.js cargado correctamente');
});

function handleClientAccess() {
    const architectElements = document.querySelectorAll('.architect-only');
    architectElements.forEach(el => {
        el.style.display = 'none';
    });

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
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                }
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