// JS/architects.js

class ArchitectManager {
    constructor() {
        this.architects = [
            {
                id: 1,
                name: "María González",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                specialty: "Arquitectura Residencial",
                experience: "8 años",
                contact: "maria@arquitectura.com",
                bio: "Especializada en diseño residencial contemporáneo con enfoque en sostenibilidad y integración con el entorno natural.",
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
                bio: "Experto en diseño de espacios corporativos y comerciales, con más de 50 proyectos ejecutados a nivel nacional.",
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
                bio: "Especialista en modelado 3D arquitectónico y implementación de metodologías BIM para proyectos de alta complejidad.",
                social: {
                    instagram: "#",
                    behance: "#"
                }
            },
            {
                id: 4,
                name: "Roberto Sánchez",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                specialty: "Restauración Patrimonial",
                experience: "15 años",
                contact: "roberto@restauracion.com",
                bio: "Especialista en restauración de patrimonio arquitectónico con más de 20 proyectos de conservación.",
                social: {
                    linkedin: "#"
                }
            }
        ];
    }

    getArchitectById(id) {
        // Encontramos el arquitecto por ID. Si no se encuentra, devolvemos el primero (ID 1) como fallback.
        const architect = this.architects.find(arch => arch.id === parseInt(id));
        return architect || this.architects[0];
    }
}