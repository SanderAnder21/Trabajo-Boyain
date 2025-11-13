// archivo: JS/projectDetail.js
class ProjectDetail {
    constructor() {
        this.projectId = this.getProjectIdFromURL();
        this.project = null;
        this.init();
    }

    getProjectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        await this.loadProject();
        this.renderProject();
        this.setupFileTabs();
        this.setupEventListeners();
    }

    async loadProject() {
        // Proyectos de prueba con diferentes tipos de archivos
        const projects = {
            '1': {
                id: 1,
                title: "Casa Moderna con Imágenes",
                architect: {
                    id: 1,
                    name: "María González",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                    specialty: "Arquitectura Residencial",
                    experience: "8 años",
                    contact: "maria@arquitectura.com",
                    bio: "Especializada en diseño residencial contemporáneo con enfoque en sostenibilidad y integración con el entorno natural."
                },
                description: "Proyecto residencial moderno con galería completa de imágenes del proceso constructivo y resultado final.",
                fullDescription: `Este proyecto representa la perfecta armonía entre la arquitectura moderna y la naturaleza. Situado en un entorno privilegiado, la casa se integra con el paisaje mediante el uso de materiales locales y técnicas de construcción sostenible.

## Características Principales:

• **Diseño bioclimático** que optimiza el uso de energía natural
• **Grandes ventanales** que aprovechan la luz natural y conectan interior-exterior
• **Sistema de recolección** de agua pluvial para riego
• **Materiales ecológicos**: madera certificada y piedra local
• **Espacios fluidos** que promueven la circulación y visuales continuas

## Proceso Constructivo:

El proyecto fue desarrollado en 3 fases principales over 18 meses, manteniendo siempre el respeto por el entorno natural y utilizando técnicas de construcción de bajo impacto ambiental.`,
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
                images: [
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
                ],
                pdfs: [],
                model3d: { hasModel: false },
                styles: ["moderno", "minimalista", "sostenible"],
                technicalTags: ["Imágenes", "Proyecto Construido", "Fotografía Profesional"],
                type: "residencial",
                rating: 4.8,
                views: 124,
                date: "2024-01-15",
                location: "Bosque de las Lomas, Ciudad de México",
                area: "320 m²",
                budget: "$450,000 USD",
                duration: "18 meses",
                fileType: "images"
            },
            '2': {
                id: 2,
                title: "Planos de Edificio Corporativo",
                architect: {
                    id: 2,
                    name: "Carlos Rodríguez",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                    specialty: "Arquitectura Comercial",
                    experience: "12 años",
                    contact: "carlos@estudiocomercial.com",
                    bio: "Experto en diseño de espacios corporativos y comerciales, con más de 50 proyectos ejecutados a nivel nacional."
                },
                description: "Documentación completa de planos arquitectónicos en PDF: plantas, elevaciones y detalles constructivos.",
                fullDescription: `Documentación técnica exhaustiva del edificio corporativo "Torre Empresarial Norte", un proyecto emblemático de arquitectura comercial contemporánea.

## Documentación Incluida:

• **Planos de planta** por cada nivel (8 plantas)
• **Elevaciones** norte, sur, este y oeste
• **Secciones** transversales y longitudinales
• **Detalles constructivos** de fachada y estructura
• **Especificaciones técnicas** de materiales
• **Memoria descriptiva** y cálculos estructurales

## Especificaciones Técnicas:

• **Área construida**: 2,800 m²
• **Altura**: 35 metros
• **Estructura**: Acero y concreto
• **Fachada**: Vidrio inteligente y aluminio compuesto
• **Sostenibilidad**: Certificación LEED Gold objetivo`,
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
                images: [],
                pdfs: [
                    "../IMG/PLANO-3-35-12.pdf",
                    "../IMG/R-3_PROT._ARQUITECTONICOS.pdf"
                ],
                model3d: { hasModel: false },
                styles: ["moderno", "industrial"],
                technicalTags: ["Planos PDF", "Documentación Técnica", "Planos Arquitectónicos"],
                type: "comercial",
                rating: 4.6,
                views: 89,
                date: "2024-01-10",
                location: "Santa Fe, Ciudad de México",
                area: "2,800 m²",
                budget: "$2.5M USD",
                duration: "24 meses",
                fileType: "pdf"
            },
            '3': {
                id: 3,
                title: "Modelado 3D Residencial",
                architect: {
                    id: 3,
                    name: "Ana Martínez",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                    specialty: "Visualización 3D y BIM",
                    experience: "6 años",
                    contact: "ana@modelados3d.com",
                    bio: "Especialista en modelado 3D arquitectónico y implementación de metodologías BIM para proyectos de alta complejidad."
                },
                description: "Modelo 3D interactivo de proyecto residencial con visualización de espacios interiores y exteriores.",
                fullDescription: `Modelo tridimensional interactivo del proyecto "Casa Contemporánea", desarrollado con tecnología de vanguardia para visualización arquitectónica.

## Características del Modelo 3D:

• **Geometría detallada** de exteriores e interiores
• **Texturas y materiales** realistas de alta resolución
• **Escala y proporciones** precisas (1:1)
• **Iluminación natural** y artificial simulada
• **Compatibilidad** con software profesional (Revit, SketchUp, 3ds Max)

## Especificaciones Técnicas:

• **Polígonos**: 1.2 millones
• **Texturas**: 4K resolution
• **Formatos disponibles**: OBJ, FBX, SKP, RVT
• **Software de origen**: Revit + 3ds Max
• **Tiempo de render**: 48 horas por vista

## Controles de Navegación:

• **Click y arrastre** para rotar
• **Rueda del mouse** para zoom
• **Click derecho** para pan
• **Botones de control** para funciones específicas`,
                image: "https://images.unsplash.com/photo-1600585154340-9635ecca45d9?w=800&h=500&fit=crop",
                images: [
                    "https://images.unsplash.com/photo-1600585154340-9635ecca45d9?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1600607687920-9d7bf7c7bda3?w=800&h=600&fit=crop"
                ],
                pdfs: [],
                model3d: {
                    file: "../IMG/project3.obj",
                    format: "obj",
                    hasModel: true,
                    textures: [
                        "../IMG/textures/concrete.jpg",
                        "../IMG/textures/wood.jpg",
                        "../IMG/textures/glass.png"
                    ]
                },
                styles: ["contemporaneo", "sostenible"],
                technicalTags: ["Modelo 3D", "Interactivo", "BIM", "Visualización"],
                type: "residencial",
                rating: 4.9,
                views: 156,
                date: "2024-01-05",
                location: "Interlomas, Estado de México",
                area: "450 m²",
                budget: "$680,000 USD",
                duration: "14 meses",
                fileType: "3d"
            },
            '4': {
                id: 4,
                title: "Restauración de Casa Colonial",
                architect: {
                    id: 4,
                    name: "Roberto Sánchez",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    specialty: "Restauración Patrimonial",
                    experience: "15 años",
                    contact: "roberto@restauracion.com",
                    bio: "Especialista en restauración de patrimonio arquitectónico con más de 20 proyectos de conservación."
                },
                description: "Proyecto de restauración y conservación de casa del siglo XVIII.",
                fullDescription: `Intervención especializada en una casa colonial del siglo XVIII ubicada en el corazón del Centro Histórico. El proyecto combinó técnicas tradicionales de restauración con tecnología moderna para preservar el valor patrimonial.

## Proceso de Restauración:

• **Análisis histórico** y documentación fotogramétrica
• **Consolidación estructural** con materiales compatibles
• **Restauración de elementos originales**: herrería, carpintería, yeserías
• **Instalación de servicios modernos** de forma no invasiva
• **Preservación de patios** y áreas comunes originales

## Técnicas Utilizadas:

• Fotogrametría 3D para documentación
• Análisis de materiales históricos
• Técnicas de conservación preventiva
• Reintegraciones cromáticas respetuosas`,
                image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=500&fit=crop",
                images: [
                    "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1494522358652-17c2b4772b1b?w=800&h=600&fit=crop"
                ],
                pdfs: [],
                model3d: { hasModel: false },
                styles: ["colonial", "patrimonial", "tradicional"],
                technicalTags: ["Restauración", "Patrimonio", "Conservación"],
                type: "restauracion",
                rating: 4.7,
                views: 203,
                date: "2024-01-20",
                location: "Centro Histórico, Ciudad de México",
                area: "280 m²",
                budget: "$320,000 USD",
                duration: "22 meses",
                fileType: "images"
            }
        };

        this.project = projects[this.projectId] || projects['1'];

        // Debug: verificar que se cargó el proyecto
        console.log('Proyecto cargado:', this.project);
        console.log('ID solicitado:', this.projectId);
        console.log('Proyecto encontrado:', this.project ? 'SÍ' : 'NO');
    }

    renderProject() {
        // Información básica
        document.getElementById('projectTitle').textContent = this.project.title;
        document.getElementById('projectMainImage').src = this.project.image;
        document.getElementById('projectFullDescription').innerHTML = this.formatDescription(this.project.fullDescription);

        // Información del arquitecto

        const architect = this.project.architect;
        const architectLink = `PerfilArquitecto.html?id=${architect.id}`;

        const architectInfo = document.querySelector('.architect-info');
        architectInfo.innerHTML = `
    <a href="${architectLink}">
        <img id="architectAvatar" src="${architect.avatar}" alt="${architect.name}" class="architect-avatar-large">
    </a>
    <div class="architect-details">
        <a href="${architectLink}" style="text-decoration: none; color: inherit;">
            <h3 id="architectName">${architect.name}</h3>
        </a>
        <p id="architectSpecialty" class="architect-specialty">${architect.specialty}</p>
        <button class="contact-architect">Contactar Arquitecto</button>
    </div>
`;
        // Estadísticas
        document.getElementById('projectRating').textContent = this.project.rating;
        document.getElementById('projectViews').textContent = this.project.views;
        document.getElementById('projectDate').textContent = this.formatDate(this.project.date);

        // Información adicional del proyecto
        this.renderProjectDetails();

        // Etiquetas
        this.renderTags();

        // Archivos según el tipo
        this.renderFiles();
    }

    renderProjectDetails() {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'project-details-grid';
        detailsContainer.innerHTML = `
            <div class="detail-item">
                <strong>Ubicación:</strong> ${this.project.location}
            </div>
            <div class="detail-item">
                <strong>Área Construida:</strong> ${this.project.area}
            </div>
            <div class="detail-item">
                <strong>Presupuesto:</strong> ${this.project.budget}
            </div>
            <div class="detail-item">
                <strong>Duración:</strong> ${this.project.duration}
            </div>
        `;

        // Insertar después de la descripción
        const descriptionElement = document.getElementById('projectFullDescription');
        descriptionElement.parentNode.insertBefore(detailsContainer, descriptionElement.nextSibling);
    }

    renderTags() {
        const tagsContainer = document.getElementById('projectTagsFull');
        const allTags = [
            ...this.project.technicalTags,
            ...this.project.styles.map(style => this.getStyleLabel(style))
        ];

        tagsContainer.innerHTML = allTags.map(tag =>
            `<span class="project-tag-large">${tag}</span>`
        ).join('');
    }

    renderFiles() {
        this.renderImages();
        this.renderPDFs();
        this.render3DModels();

        // Ocultar pestañas que no tienen contenido
        this.hideEmptyTabs();
    }

    renderImages() {
        const imagesGrid = document.getElementById('imagesGrid');

        if (this.project.images && this.project.images.length > 0) {
            imagesGrid.innerHTML = '';

            this.project.images.forEach((image, index) => {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.innerHTML = `
                    <img src="${image}" alt="Imagen ${index + 1} del proyecto ${this.project.title}" loading="lazy">
                    <div class="image-overlay">
                        <span class="zoom-icon">🔍</span>
                    </div>
                `;

                imageItem.addEventListener('click', () => {
                    this.openImageModal(image, `Imagen ${index + 1} - ${this.project.title}`);
                });

                imagesGrid.appendChild(imageItem);
            });
        } else {
            imagesGrid.innerHTML = `
                <div class="no-files-message">
                    <p>No hay imágenes disponibles para este proyecto.</p>
                </div>
            `;
        }
    }

    renderPDFs() {
        const pdfViewer = document.getElementById('pdfFrame');

        if (this.project.pdfs && this.project.pdfs.length > 0) {
            // Mostrar el primer PDF
            pdfViewer.src = this.project.pdfs[0];

            // Si hay múltiples PDFs, agregar selector
            if (this.project.pdfs.length > 1) {
                this.createPDFSelector();
            }
        } else {
            document.getElementById('pdfs-pane').innerHTML = `
                <div class="no-files-message">
                    <p>No hay documentos PDF disponibles para este proyecto.</p>
                </div>
            `;
        }
    }

    createPDFSelector() {
        const pdfSelector = document.createElement('div');
        pdfSelector.className = 'pdf-selector';
        pdfSelector.innerHTML = `
            <label for="pdfSelect">Seleccionar documento:</label>
            <select id="pdfSelect">
                ${this.project.pdfs.map((pdf, index) =>
            `<option value="${pdf}">Documento ${index + 1}</option>`
        ).join('')}
            </select>
        `;

        const pdfPane = document.getElementById('pdfs-pane');
        pdfPane.insertBefore(pdfSelector, pdfPane.firstChild);

        document.getElementById('pdfSelect').addEventListener('change', (e) => {
            document.getElementById('pdfFrame').src = e.target.value;
        });
    }

    render3DModels() {
        const modelViewer = document.getElementById('project3DViewer');

        if (this.project.model3d && this.project.model3d.hasModel) {
            // Mostrar interfaz de modelo 3D
            modelViewer.style.display = 'block';
            this.setup3DViewer();
        } else {
            document.getElementById('3d-pane').innerHTML = `
                <div class="no-files-message">
                    <p>No hay modelos 3D disponibles para este proyecto.</p>
                    ${this.project.images ? `
                        <p>Puedes explorar las imágenes del proyecto en la pestaña de Imágenes.</p>
                    ` : ''}
                </div>
            `;
        }
    }

setup3DViewer() {
        const container = document.querySelector('.model-viewer');
        const canvas = document.getElementById('project3DViewer');
        if (!container || !canvas) return;

        // 1. Configuración básica de Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f8f8); // Fondo gris claro

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5; // Alejar la cámara

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);

        // 2. Añadir luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // 3. Añadir Controles (rotar/zoom con el mouse)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Suaviza el movimiento

        // 4. Cargar el modelo .OBJ
        const loader = new THREE.OBJLoader();
        const modelPath = this.project.model3d.file; //

        loader.load(
            // Ruta al modelo
            modelPath,
            // onSuccess (cuando se carga)
            function (object) {
                // Centrar el modelo en la escena
                new THREE.Box3().setFromObject(object).getCenter(object.position).multiplyScalar(-1);
                scene.add(object);
            },
            // onProgress (mientras carga)
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            // onError (si falla)
            function (error) {
                console.error('Error al cargar el modelo 3D', error);
                container.innerHTML = `<div class="no-files-message"><p>Error al cargar el modelo 3D.</p></div>`;
            }
        );

        // 5. Bucle de animación
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); // Actualizar controles
            renderer.render(scene, camera);
        }

        // Iniciar la animación
        animate();

        // Ajustar el tamaño si la ventana cambia
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    hideEmptyTabs() {
        const tabs = document.querySelectorAll('.file-tab');

        tabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            const pane = document.getElementById(`${tabName}-pane`);

            // Verificar si el panel tiene contenido
            const hasContent = pane.querySelector('.no-files-message') === null;

            if (!hasContent &&
                !(tabName === 'images' && this.project.images) &&
                !(tabName === 'pdfs' && this.project.pdfs) &&
                !(tabName === '3d' && this.project.model3d)) {
                tab.style.display = 'none';
            }
        });
    }

    setupFileTabs() {
        const tabs = document.querySelectorAll('.file-tab');
        const panes = document.querySelectorAll('.file-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remover active de todos
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Activar tab clickeado
                tab.classList.add('active');
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(`${tabName}-pane`).classList.add('active');
            });
        });
    }

    setupEventListeners() {
        // Contactar arquitecto
        document.querySelector('.contact-architect').addEventListener('click', () => {
            this.contactArchitect();
        });

        // --- Añadir listeners para el nuevo modal ---
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            // Listener para el botón de cerrar (X)
            contactModal.querySelector('.close-contact-modal').addEventListener('click', () => {
                this.closeContactModal();
            });

            // Listener para el overlay (cerrar al hacer clic afuera)
            contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) {
                    this.closeContactModal();
                }
            });
        }
    }
    contactArchitect() {
        const modal = document.getElementById('contactModal');
        if (!modal) return; // Salir si el modal no existe

        // Obtenemos los datos del arquitecto del proyecto cargado
        const architect = this.project.architect;

        // Rellenamos los datos del modal
        document.getElementById('modalArchitectAvatar').src = architect.avatar;
        document.getElementById('modalArchitectName').textContent = architect.name;
        document.getElementById('modalArchitectSpecialty').textContent = architect.specialty;
        document.getElementById('modalArchitectEmail').textContent = architect.contact;
        document.getElementById('modalArchitectEmail').href = `mailto:${architect.contact}`;
        document.getElementById('modalArchitectBio').textContent = architect.bio || 'No hay biografía disponible.';

        // Mostrar el modal
        modal.style.display = 'flex';
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    openImageModal(src, alt) {
        // Crear modal si no existe
        if (!document.getElementById('imageModal')) {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <img id="modalImage" src="" alt="">
                    <div class="modal-caption"></div>
                    <div class="modal-nav">
                        <button class="nav-btn prev-btn">‹</button>
                        <button class="nav-btn next-btn">›</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event listeners del modal
            modal.querySelector('.close-modal').addEventListener('click', () => this.closeImageModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeImageModal();
            });
        }

        const modal = document.getElementById('imageModal');
        const modalImage = modal.querySelector('#modalImage');
        const caption = modal.querySelector('.modal-caption');

        modalImage.src = src;
        caption.textContent = alt;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    formatDescription(text) {
        // Convertir markdown simple a HTML
        return text
            .replace(/\n\s*•\s*/g, '\n• ')
            .replace(/\n## (.*?)\n/g, '\n<h4>$1</h4>\n')
            .replace(/\n\*\*(.*?)\*\*/g, '\n<strong>$1</strong>')
            .replace(/\n/g, '</p><p>')
            .replace(/<p><\/p>/g, '')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
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
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('es-ES', options);
        } catch (e) {
            return dateString;
        }
    }
}

// Inicializar la página de detalle
// CAMBIO: Usar 'load' en lugar de 'DOMContentLoaded'
// Esto espera a que scripts externos (como Three.js) terminen de cargarse.
window.addEventListener('load', () => {
    new ProjectDetail();
});