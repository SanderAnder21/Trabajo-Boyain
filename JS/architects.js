// JS/architects.js

import { DataService } from './services/DataService.js';

class ArchitectManager {
    constructor() {
        this.architects = [];
        this.dataService = new DataService();
        this.init();
    }
    
    async init() {
        await this.loadArchitects();
    }
    
    async loadArchitects() {
        try {
            console.log('👤 Cargando arquitectos desde API...');
            
            // Cargar proyectos para extraer información de arquitectos
            const projects = await this.dataService.getProjects();
            
            // Extraer arquitectos únicos de los proyectos
            const architectsMap = new Map();
            
            projects.forEach(project => {
                if (project.arquitecto_nombre && project.arquitecto_id) {
                    if (!architectsMap.has(project.arquitecto_id)) {
                        architectsMap.set(project.arquitecto_id, {
                            id: project.arquitecto_id,
                            name: project.arquitecto_nombre,
                            avatar: project.arquitecto_avatar || '../IMG/default-avatar.jpg',
                            specialty: project.arquitecto_especialidad || 'Arquitectura'
                        });
                    }
                }
            });
            
            this.architects = Array.from(architectsMap.values());
            console.log('📊 Arquitectos cargados:', this.architects);
            
        } catch (error) {
            console.error('❌ Error cargando arquitectos:', error);
            this.loadFallbackArchitects();
        }
    }
    
    loadFallbackArchitects() {
        console.log('🔄 Cargando arquitectos de prueba...');
        this.architects = [
            {
                id: 1,
                name: "María González",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                specialty: "Arquitectura Residencial"
            },
            {
                id: 2,
                name: "Carlos Rodríguez",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                specialty: "Arquitectura Comercial"
            }
        ];
    }
}

// Hacer disponible globalmente
window.ArchitectManager = ArchitectManager;