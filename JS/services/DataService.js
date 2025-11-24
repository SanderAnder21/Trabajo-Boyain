/**
 * Servicio de Datos
 * Centraliza el acceso a la información de proyectos y arquitectos.
 */
export class DataService {
    constructor() {
        // Simulamos una base de datos local
        this.projectsData = [
            {
                id: 1,
                nombre: "Residencia Moderna",
                descripcion: "Diseño minimalista con espacios abiertos y luz natural.",
                imagen: "IMG/project1.jpg",
                tipo: "Residencial",
                estado: "Finalizado",
                ubicacion: "Zacatecas, Centro",
                fecha: "2023-05-15",
                arquitecto_id: 101
            },
            {
                id: 2,
                nombre: "Torre Corporativa A",
                descripcion: "Edificio de oficinas sustentable con certificación LEED.",
                imagen: "IMG/project2.jpg", // Asegúrate de tener imágenes reales o placeholders
                tipo: "Comercial",
                estado: "En Construcción",
                ubicacion: "Guadalupe, ZAC",
                fecha: "2024-01-10",
                arquitecto_id: 102
            },
            {
                id: 3,
                nombre: "Parque Urbano Central",
                descripcion: "Rehabilitación de espacio público con áreas verdes.",
                imagen: "IMG/project3.jpg",
                tipo: "Urbano",
                estado: "Planeación",
                ubicacion: "Fresnillo, ZAC",
                fecha: "2024-08-20",
                arquitecto_id: 101
            }
            // Agrega aquí más proyectos copiados de tu antiguo projects.js
        ];
    }

    /**
     * Obtiene todos los proyectos (Simula una promesa asíncrona)
     * @returns {Promise<Array>}
     */
    async getAllProjects() {
        // Simulamos un pequeño delay de red
        return new Promise(resolve => {
            setTimeout(() => resolve(this.projectsData), 300);
        });
    }

    /**
     * Obtiene un proyecto por ID
     */
    async getProjectById(id) {
        return this.projectsData.find(p => p.id == id);
    }

    /**
     * Obtiene proyectos filtrados por categoría
     */
    async getProjectsByCategory(category) {
        if (category === 'Todos') return this.getAllProjects();
        return this.projectsData.filter(p => p.tipo === category);
    }
}