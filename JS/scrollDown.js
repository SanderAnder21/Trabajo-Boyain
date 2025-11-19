
document.addEventListener('DOMContentLoaded', function () {
    const scrollDownBtn = document.querySelector('.btn-scroll-down');

    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Obtener el ID del destino (contenidoPrincipal)
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Usar el método nativo scrollIntoView con comportamiento 'smooth'
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});