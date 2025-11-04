// archivo: JS/projectsGallery.js
class ProjectsGallery {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.init();
    }
    
    init() {
        this.loadProjects();
        this.setupFilters();
    }
    
    loadProjects() {
        // Proyectos de prueba específicos para cada tipo de archivo
        this.projects = [
            {
                id: 1,
                title: "Casa Moderna con Imágenes",
                architect: {
                    name: "María González",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                },
                description: "Proyecto residencial moderno con galería completa de imágenes del proceso constructivo y resultado final.",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop",
                styles: ["moderno", "minimalista"],
                type: "residencial",
                rating: 4.8,
                views: 124,
                date: "2024-01-15",
                tags: ["Imágenes", "Proyecto Construido"],
                // Datos específicos para la página de detalle
                images: [
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
                ],
                fileType: "images"
            },
            {
                id: 2,
                title: "Planos de Edificio Corporativo",
                architect: {
                    name: "Carlos Rodríguez", 
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                },
                description: "Documentación completa de planos arquitectónicos en PDF: plantas, elevaciones y detalles constructivos.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
                styles: ["moderno", "industrial"],
                type: "comercial", 
                rating: 4.6,
                views: 89,
                date: "2024-01-10",
                tags: ["Planos PDF", "Documentación"],
                // PDF de ejemplo (puedes reemplazar con tu PDF)
                pdfs: [
                    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                ],
                fileType: "pdf"
            },
            {
                id: 3,
                title: "Modelado 3D Residencial",
                architect: {
                    name: "Ana Martínez",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                },
                description: "Modelo 3D interactivo de proyecto residencial con visualización de espacios interiores y exteriores.",
                image: "https://images.unsplash.com/photo-1600585154340-9635ecca45d9?w=400&h=250&fit=crop",
                styles: ["contemporaneo", "sostenible"],
                type: "residencial",
                rating: 4.9,
                views: 156,
                date: "2024-01-05",
                tags: ["Modelo 3D", "Interactivo"],
                // Información para el modelo 3D
                model3d: {
                    file: "../IMG/project3.obj", // Ruta a tu archivo 3D
                    format: "obj",
                    hasModel: true
                },
                fileType: "3d"
            }
        ];
        
        this.filteredProjects = [...this.projects];
        this.renderProjects();
    }
    
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';
        
        this.filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            grid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('a');
        card.href = `ProyectoDetalle.html?id=${project.id}`;
        card.className = 'project-card';
        
        // Icono según el tipo de archivo principal
        const fileIcon = this.getFileTypeIcon(project.fileType);
        
        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='../IMG/default-project.jpg'">
                <div class="file-type-badge">${fileIcon}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                
                <div class="project-architect">
                    <img src="${project.architect.avatar}" alt="${project.architect.name}" class="architect-avatar" onerror="this.src='../IMG/default-avatar.jpg'">
                    <span class="architect-name">${project.architect.name}</span>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    ${project.styles.map(style => `<span class="project-tag">${this.getStyleLabel(style)}</span>`).join('')}
                </div>
                
                <div class="project-meta">
                    <div class="project-rating">
                        <span class="star">⭐</span>
                        <span>${project.rating}</span>
                        <span>(${project.views} vistas)</span>
                    </div>
                    <span>${this.formatDate(project.date)}</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getFileTypeIcon(fileType) {
        const icons = {
            'images': '🖼️',
            'pdf': '📄', 
            '3d': '🎮'
        };
        return icons[fileType] || '📁';
    }
    
    setupFilters() {
        const searchInput = document.querySelector('.search-box input');
        const styleFilter = document.getElementById('filterStyle');
        const typeFilter = document.getElementById('filterType');
        const sortFilter = document.getElementById('filterSort');
        
        searchInput.addEventListener('input', () => this.filterProjects());
        styleFilter.addEventListener('change', () => this.filterProjects());
        typeFilter.addEventListener('change', () => this.filterProjects());
        sortFilter.addEventListener('change', () => this.filterProjects());
    }
    
    filterProjects() {
        const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
        const styleFilter = document.getElementById('filterStyle').value;
        const typeFilter = document.getElementById('filterType').value;
        const sortFilter = document.getElementById('filterSort').value;
        
        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                project.architect.name.toLowerCase().includes(searchTerm) ||
                                project.description.toLowerCase().includes(searchTerm);
            
            const matchesStyle = !styleFilter || project.styles.includes(styleFilter);
            const matchesType = !typeFilter || project.type === typeFilter;
            
            return matchesSearch && matchesStyle && matchesType;
        });
        
        this.sortProjects(sortFilter);
        this.renderProjects();
    }
    
    sortProjects(sortBy) {
        switch(sortBy) {
            case 'newest':
                this.filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                this.filteredProjects.sort((a, b) => b.views - a.views);
                break;
            case 'rating':
                this.filteredProjects.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
    
    getStyleLabel(style) {
        const styles = {
            'minimalista': 'Minimalista',
            'moderno': 'Moderno',
            'contemporaneo': 'Contemporáneo',
            'gotico': 'Gótico',
            'colonial': 'Colonial',
            'rustico': 'Rústico',
            'industrial': 'Industrial',
            'sostenible': 'Sostenible'
        };
        return styles[style] || style;
    }
    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
}

// Inicializar la galería
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsGallery();
});