document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // 1. Mostrar/ocultar el menú al hacer clic en el ícono
    userIcon.addEventListener('click', function(event) {
        // Detiene la propagación para que el clic no se detecte en el 'window'
        event.stopPropagation(); 
        dropdownMenu.classList.toggle('show');
    });

    // 2. Cerrar el menú si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });
});