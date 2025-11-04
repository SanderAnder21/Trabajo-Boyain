// JS/projectList.js
class ProjectList {
    constructor() {
        this.projectManager = new ProjectManager();
        this.currentProjects = this.projectManager.getAllProjects();
        this.init();
    }

    init() {
        this.renderProjects();
        this.setupFilters();
    }

    renderProjects() {
        const container = document.getElementById('projectsGrid');
        if (!container) return;

        container.innerHTML = this.currentProjects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p class="architect">Por: ${project.architect.name}</p>
                    <p class="description">${project.description}</p>
                    <div class="project-meta">
                        <span class="rating">⭐ ${project.rating}</span>
                        <span class="views">👁️ ${project.views}</span>
                        <span class="date">📅 ${project.date}</span>
                    </div>
                    <div class="project-tags">
                        ${project.styles.map(style => 
                            `<span class="tag">${style}</span>`
                        ).join('')}
                    </div>
                    <a href="ProyectoDetalle.html?id=${project.id}" class="view-project-btn">
                        Ver Detalles
                    </a>
                </div>
            </div>
        `).join('');
    }

    setupFilters() {
        // Implementar filtros por tipo, estilo, etc.
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterProjects(filter);
            });
        });

        // Buscador
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProjects(e.target.value);
            });
        }
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.currentProjects = this.projectManager.getAllProjects();
        } else {
            this.currentProjects = this.projectManager.getProjectsByType(filter);
        }
        this.renderProjects();
    }

    searchProjects(query) {
        if (query.trim() === '') {
            this.currentProjects = this.projectManager.getAllProjects();
        } else {
            this.currentProjects = this.projectManager.searchProjects(query);
        }
        this.renderProjects();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProjectList();
});