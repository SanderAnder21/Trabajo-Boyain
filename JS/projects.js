// JS/projects.js
class ProjectManager {
    constructor() {
        this.projects = this.getAllProjects();
    }

    getAllProjects() {
        return [
            {
                id: 1,
                title: "Casa Moderna con Imágenes",
                architect: {
                    name: "María González",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                    specialty: "Arquitectura Residencial"
                },
                description: "Proyecto residencial moderno con galería completa de imágenes.",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
                rating: 4.8,
                views: 124,
                date: "2024-01-15",
                type: "residencial",
                styles: ["moderno", "minimalista"],
                location: "Bosque de las Lomas, CDMX"
            },
            {
                id: 2,
                title: "Planos de Edificio Corporativo",
                architect: {
                    name: "Carlos Rodríguez", 
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                    specialty: "Arquitectura Comercial"
                },
                description: "Documentación completa de planos arquitectónicos en PDF.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
                rating: 4.6,
                views: 89,
                date: "2024-01-10",
                type: "comercial", 
                styles: ["moderno", "industrial"],
                location: "Santa Fe, CDMX"
            },
            {
                id: 3,
                title: "Modelado 3D Residencial", 
                architect: {
                    name: "Ana Martínez",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                    specialty: "Visualización 3D y BIM"
                },
                description: "Modelo 3D interactivo de proyecto residencial.",
                image: "https://images.unsplash.com/photo-1600585154340-9635ecca45d9?w=400&h=300&fit=crop",
                rating: 4.9,
                views: 156,
                date: "2024-01-05",
                type: "residencial",
                styles: ["contemporaneo", "sostenible"],
                location: "Interlomas, Estado de México"
            },
            {
                id: 4,
                title: "Restauración de Casa Colonial",
                architect: {
                    name: "Roberto Sánchez",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    specialty: "Restauración Patrimonial"
                },
                description: "Proyecto de restauración y conservación de casa del siglo XVIII.",
                image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop",
                rating: 4.7,
                views: 203,
                date: "2024-01-20", 
                type: "restauracion",
                styles: ["colonial", "patrimonial"],
                location: "Centro Histórico, CDMX"
            }
        ];
    }

    getProjectById(id) {
        return this.projects.find(project => project.id === parseInt(id));
    }

    getProjectsByType(type) {
        return this.projects.filter(project => project.type === type);
    }

    getProjectsByStyle(style) {
        return this.projects.filter(project => 
            project.styles.includes(style)
        );
    }

    searchProjects(query) {
        const lowerQuery = query.toLowerCase();
        return this.projects.filter(project =>
            project.title.toLowerCase().includes(lowerQuery) ||
            project.architect.name.toLowerCase().includes(lowerQuery) ||
            project.location.toLowerCase().includes(lowerQuery) ||
            project.styles.some(style => style.toLowerCase().includes(lowerQuery))
        );
    }
}