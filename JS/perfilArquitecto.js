class PerfilArquitecto {
    constructor() {
        this.architectId = this.getArchitectIdFromURL();
        this.architectManager = new ArchitectManager();
        this.projectManager = new ProjectManager(); //
        
        this.architect = this.architectManager.getArchitectById(this.architectId);
        
        this.init();
    }

    getArchitectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 1; // Devuelve 1 si no hay ID
    }

    init() {
        this.renderArchitectInfo();
        this.renderArchitectProjects();
    }

    renderArchitectInfo() {
        if (!this.architect) return; // Salir si no hay arquitecto

        document.title = `${this.architect.name} - PortArq`; // Actualiza el título de la pestaña

        document.getElementById('perfil-avatar').src = this.architect.avatar;
        document.getElementById('perfil-avatar').alt = this.architect.name;
        document.getElementById('perfil-nombre').textContent = this.architect.name;
        document.getElementById('perfil-especialidad').textContent = this.architect.specialty;
        document.getElementById('perfil-email').textContent = this.architect.contact;
        document.getElementById('perfil-email').href = `mailto:${this.architect.contact}`;
        document.getElementById('perfil-bio').textContent = this.architect.bio;

        // Renderizar redes sociales
        const redesContainer = document.getElementById('perfil-redes');
        redesContainer.innerHTML = ''; // Limpiar links estáticos
        if (this.architect.social.linkedin) {
            redesContainer.innerHTML += `<a href="${this.architect.social.linkedin}" target="_blank">LinkedIn</a>`;
        }
        if (this.architect.social.instagram) {
            redesContainer.innerHTML += `<a href="${this.architect.social.instagram}" target="_blank">Instagram</a>`;
        }
        if (this.architect.social.behance) {
            redesContainer.innerHTML += `<a href="${this.architect.social.behance}" target="_blank">Behance</a>`;
        }
    }

    renderArchitectProjects() {
        const grid = document.getElementById('proyectosArquitecto'); //
        if (!grid) return;

        // Filtramos TODOS los proyectos para encontrar solo los de este arquitecto
        const allProjects = this.projectManager.getAllProjects(); //
        const architectProjects = allProjects.filter(project => 
            project.architect.name === this.architect.name
        );

        if (architectProjects.length === 0) {
            grid.innerHTML = "<p>Este arquitecto aún no tiene proyectos publicados.</p>";
            return;
        }

        // Reutilizamos el HTML de Proyectos.css
        grid.innerHTML = architectProjects.map(project => `
            <a href="ProyectoDetalle.html?id=${project.id}" class="project-card">
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <div class="project-rating">
                            <span class="star">⭐</span>
                            <span>${project.rating}</span>
                        </div>
                        <span>${project.date}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PerfilArquitecto();
});