// JS/projectsGallery.js

import { DataService } from './services/DataService.js';

class ProjectsGallery {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.dataService = new DataService();
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.setupFilters();
    }
    
    async loadProjects() {
        try {
            console.log('📦 Cargando proyectos reales desde API...');
            
            // Cargar proyectos reales desde la API
            this.projects = await this.dataService.getProjects();
            console.log('📊 Proyectos cargados:', this.projects);
            
            this.filteredProjects = [...this.projects];
            this.renderProjects();
            
        } catch (error) {
            console.error('❌ Error cargando proyectos:', error);
            // Fallback a datos de prueba si la API falla
            this.loadFallbackProjects();
        }
    }
    
    /**
     * Datos de prueba como fallback
     */
    loadFallbackProjects() {
        console.log('🔄 Cargando datos de prueba...');
        this.projects = [
            {
                id: 1,
                titulo: "Casa Moderna con Imágenes",
                arquitecto_nombre: "María González",
                arquitecto_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                descripcion: "Proyecto residencial moderno con galería completa de imágenes del proceso constructivo y resultado final.",
                imagen_principal: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop",
                tipo: "residencial",
                total_vistas: 124,
                fecha_publicacion: "2024-01-15"
            },
            {
                id: 2,
                titulo: "Edificio Corporativo",
                arquitecto_nombre: "Carlos Rodríguez", 
                arquitecto_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                descripcion: "Documentación completa de planos arquitectónicos en PDF: plantas, elevaciones y detalles constructivos.",
                imagen_principal: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
                tipo: "comercial", 
                total_vistas: 89,
                fecha_publicacion: "2024-01-10"
            }
        ];
        
        this.filteredProjects = [...this.projects];
        this.renderProjects();
    }
    
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) {
            console.error('❌ No se encontró el contenedor projectsGrid');
            return;
        }
        
        grid.innerHTML = '';
        
        if (this.filteredProjects.length === 0) {
            grid.innerHTML = `
                <div class="no-projects-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>📝 No se encontraron proyectos</h3>
                    <p>No hay proyectos que coincidan con tus filtros.</p>
                </div>
            `;
            return;
        }
        
        this.filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            grid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('a');
        card.href = `ProyectoDetalle.html?id=${project.id}`;
        card.className = 'project-card';
        
        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.imagen_principal || '../IMG/project1.jpg'}" 
                     alt="${project.titulo}" 
                     class="project-image" 
                     onerror="this.src='../IMG/project1.jpg'">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.titulo || 'Proyecto sin título'}</h3>
                
                <div class="project-architect">
                    <img src="${project.arquitecto_avatar || '../IMG/default-avatar.jpg'}" 
                         alt="${project.arquitecto_nombre || 'Arquitecto'}" 
                         class="architect-avatar" 
                         onerror="this.src='../IMG/default-avatar.jpg'">
                    <span class="architect-name">${project.arquitecto_nombre || 'Arquitecto'}</span>
                </div>
                
                <p class="project-description">${project.descripcion || 'Sin descripción disponible'}</p>
                
                <div class="project-tags">
                    <span class="project-tag">${this.getProjectTypeLabel(project.tipo)}</span>
                    <span class="project-tag">${project.ubicacion || 'Ubicación no especificada'}</span>
                </div>
                
                <div class="project-meta">
                    <div class="project-stats">
                        <span>👁️ ${project.total_vistas || 0} vistas</span>
                    </div>
                    <span class="project-date">${this.formatDate(project.fecha_publicacion || project.fecha_creacion)}</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Obtiene la etiqueta legible del tipo de proyecto
     */
    getProjectTypeLabel(type) {
        const types = {
            'residencial': 'Residencial',
            'comercial': 'Comercial', 
            'restauracion': 'Restauración',
            'industrial': 'Industrial',
            'institucional': 'Institucional'
        };
        return types[type] || type || 'No especificado';
    }
    
    setupFilters() {
        const searchInput = document.getElementById('projectSearch');
        const styleFilter = document.getElementById('filterStyle');
        const typeFilter = document.getElementById('filterType');
        const sortFilter = document.getElementById('filterSort');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProjects());
        }
        if (styleFilter) {
            styleFilter.addEventListener('change', () => this.filterProjects());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterProjects());
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.filterProjects());
        }
    }
    
    filterProjects() {
        const searchInput = document.getElementById('projectSearch');
        const styleFilter = document.getElementById('filterStyle');
        const typeFilter = document.getElementById('filterType');
        const sortFilter = document.getElementById('filterSort');
        
        if (!searchInput || !styleFilter || !typeFilter || !sortFilter) {
            console.error('❌ No se encontraron elementos de filtro');
            return;
        }
        
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStyle = styleFilter.value;
        const selectedType = typeFilter.value;
        const selectedSort = sortFilter.value;
        
        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = 
                (project.titulo && project.titulo.toLowerCase().includes(searchTerm)) ||
                (project.arquitecto_nombre && project.arquitecto_nombre.toLowerCase().includes(searchTerm)) ||
                (project.descripcion && project.descripcion.toLowerCase().includes(searchTerm)) ||
                (project.ubicacion && project.ubicacion.toLowerCase().includes(searchTerm));
            
            const matchesType = !selectedType || project.tipo === selectedType;
            
            // Nota: Para estilos necesitarías tener un campo 'estilos' en tu proyecto
            const matchesStyle = !selectedStyle; // Por ahora no filtramos por estilo
            
            return matchesSearch && matchesType && matchesStyle;
        });
        
        this.sortProjects(selectedSort);
        this.renderProjects();
    }
    
    sortProjects(sortBy) {
        switch(sortBy) {
            case 'newest':
                this.filteredProjects.sort((a, b) => 
                    new Date(b.fecha_publicacion || b.fecha_creacion) - new Date(a.fecha_publicacion || a.fecha_creacion)
                );
                break;
            case 'popular':
                this.filteredProjects.sort((a, b) => (b.total_vistas || 0) - (a.total_vistas || 0));
                break;
            case 'rating':
                // Por ahora usamos vistas como rating
                this.filteredProjects.sort((a, b) => (b.total_vistas || 0) - (a.total_vistas || 0));
                break;
        }
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';
        
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        } catch (error) {
            return 'Fecha inválida';
        }
    }
}

// Inicializar la galería
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsGallery();
});