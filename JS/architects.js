// JS/architects.js - VERSIÓN FINAL CORREGIDA

import { DataService } from './services/DataService.js';

class ArchitectManager {
    constructor() {
        this.architects = [];
        this.isLoaded = false;
    }
    
    async init() {
        if (!this.isLoaded) {
            await this.loadArchitects();
            this.isLoaded = true;
        }
        return this.architects;
    }
    
    async loadArchitects() {
        try {
            console.log('👤 Cargando arquitectos desde API...');
            
            const response = await fetch('/api/architects');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.architects) {
                this.architects = data.architects.map(arch => ({
                    id: arch.id,
                    name: arch.name,
                    avatar: arch.avatar || '../IMG/default-avatar.jpg',
                    specialty: arch.specialty || 'Arquitectura General',
                    projectCount: arch.total_projects || 0, // CORREGIDO: total_projects
                    bio: arch.bio || ''
                }));
                
                console.log('✅ Arquitectos cargados desde API:', this.architects);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
            
        } catch (error) {
            console.error('❌ Error cargando arquitectos:', error);
            await this.loadFallbackArchitects();
        }
    }
    
    async loadFallbackArchitects() {
        console.log('🔄 Cargando arquitectos de prueba...');
        this.architects = [
            {
                id: 1,
                name: "Arquitecto Demo",
                avatar: "../IMG/default-avatar.jpg",
                specialty: "Arquitectura General",
                projectCount: 3
            }
        ];
    }
    
    async getArchitects() {
        return await this.init();
    }
    
    async getArchitectById(id) {
        await this.init();
        return this.architects.find(arch => arch.id == id) || null;
    }
    
    async searchArchitects(searchTerm) {
        await this.init();
        const term = searchTerm.toLowerCase();
        return this.architects.filter(arch =>
            arch.name.toLowerCase().includes(term) ||
            (arch.specialty && arch.specialty.toLowerCase().includes(term))
        );
    }
}

window.ArchitectManager = ArchitectManager;