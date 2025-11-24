import { Config } from '../config/Config.js';
import { Architect } from '../models/Architect.js';

/**
 * Servicio de Arquitectos
 */
export class ArchitectService {
    constructor() {
        this.apiUrl = Config.API_BASE_URL;
        this.mockArchitects = this.getMockArchitects();
    }

    async getAllArchitects() {
        try {
            const response = await fetch(`${this.apiUrl}/architects`);
            
            if (!response.ok) {
                throw new Error('Error al obtener arquitectos');
            }

            const data = await response.json();
            return data.map(a => new Architect(a));

        } catch (error) {
            console.log('⚠️ Usando datos mock de arquitectos');
            return this.mockArchitects.map(a => new Architect(a));
        }
    }

    async getArchitectById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/architects/${id}`);
            
            if (!response.ok) {
                throw new Error('Arquitecto no encontrado');
            }

            const data = await response.json();
            return new Architect(data);

        } catch (error) {
            console.log('⚠️ Buscando en datos mock');
            const architect = this.mockArchitects.find(a => a.id == id);
            return architect ? new Architect(architect) : null;
        }
    }

    getMockArchitects() {
        return [
            {
                id: 1,
                name: "María González",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                specialty: "Arquitectura Residencial",
                experience: "8 años",
                contact: "maria@arquitectura.com",
                bio: "Especializada en diseño residencial contemporáneo con enfoque en sostenibilidad.",
                social: {
                    linkedin: "#",
                    instagram: "#"
                }
            },
            {
                id: 2,
                name: "Carlos Rodríguez",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                specialty: "Arquitectura Comercial",
                experience: "12 años",
                contact: "carlos@estudiocomercial.com",
                bio: "Experto en diseño de espacios corporativos y comerciales.",
                social: {
                    linkedin: "#",
                    behance: "#"
                }
            },
            {
                id: 3,
                name: "Ana Martínez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                specialty: "Visualización 3D y BIM",
                experience: "6 años",
                contact: "ana@modelados3d.com",
                bio: "Especialista en modelado 3D arquitectónico y metodologías BIM.",
                social: {
                    instagram: "#",
                    behance: "#"
                }
            }
        ];
    }
}