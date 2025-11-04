document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('projectForm');
    const fileUploads = document.getElementById('fileUploads');
    const addFileBtn = document.getElementById('addFileBtn');
    const tagCheckboxes = document.querySelectorAll('input[name="tags"]');
    const tagCountElement = document.getElementById('tagCount');
    const stylecheckboxes = document.querySelectorAll('input[name="styles"]');
    const styleTagCountElement = document.getElementById('styleCount');
 
    let fileCount = 0;

    // Contador de etiquetas
    tagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTagCount);
    });

    function updateTagCount() {
        const selectedTags = document.querySelectorAll('input[name="tags"]:checked').length;
        tagCountElement.textContent = selectedTags;
        
        const submitBtn = document.querySelector('.btn-submit-project');
        if (selectedTags < 1) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            submitBtn.title = 'Selecciona al menos 1 etiqueta';
        } else {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.title = '';
        }
    }

    // Contador de estilos
    stylecheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateStyleTagCount);
    });

    function updateStyleTagCount() {
        const selectedStyles = document.querySelectorAll('input[name="styles"]:checked').length;
        styleTagCountElement.textContent = `${selectedStyles}/3`;
        
        if (selectedStyles > 3) {
            alert('Máximo 3 estilos arquitectonicos permitidos.');
            this.checked= false;
            updateStyleTagCount();
            return;
        }
    }



    // Agregar campo de archivo
    addFileBtn.addEventListener('click', function() {
        fileCount++;
        const fileGroup = document.createElement('div');
        fileGroup.className = 'file-input-group';
        fileGroup.innerHTML = `
            <input type="file" name="projectFiles[]" accept="image/*,.pdf,.dwg,.skp,.rvt" multiple>
            <input type="text" name="fileDescriptions[]" placeholder="Descripción opcional del archivo...">
            <button type="button" class="remove-file" onclick="this.parentElement.remove()">×</button>
        `;
        fileUploads.appendChild(fileGroup);
    });

    // Validación del formulario
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectName = document.getElementById('projectName').value;
        const projectDescription = document.getElementById('projectDescription').value;
        const selectedTags = document.querySelectorAll('input[name="tags"]:checked');
        
        // Validaciones
        if (selectedTags.length < 3) {
            alert('Por favor selecciona al menos 3 etiquetas para tu proyecto.');
            return;
        }
        
        if (!projectName || !projectDescription) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Aquí iría la lógica para subir el proyecto al servidor
        console.log('Proyecto a subir:', {
            name: projectName,
            description: projectDescription,
            tags: Array.from(selectedTags).map(tag => tag.value),
            files: document.querySelectorAll('input[name="projectFiles[]"]')
        });

        // Simular envío exitoso
        alert('Proyecto enviado correctamente!');
        projectForm.reset();
        fileUploads.innerHTML = '';
        fileCount = 0;
        updateTagCount();
        
        // Aquí agregarías el proyecto a la lista de proyectos existentes
        addProjectToList({
            name: projectName,
            description: projectDescription,
            tags: Array.from(selectedTags).map(tag => tag.value),
            date: new Date().toLocaleDateString()
        });
    });

    // Función para agregar proyecto a la lista
    function addProjectToList(project) {
        const projectsList = document.getElementById('projectsList');
        const noProjects = projectsList.querySelector('.no-projects');
        
        if (noProjects) {
            noProjects.remove();
        }

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${getTagLabel(tag)}</span>`).join('')}
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-files">
                <small>Subido: ${project.date}</small>
            </div>
        `;

        projectsList.appendChild(projectCard);
    }

    function getTagLabel(tagValue) {
        const labels = {
            'plano2d': 'Plano 2D',
            'modelo3d': 'Modelo 3D',
            'proyectoConstruido': 'Proyecto Construido',
            'maqueta': 'Maqueta'
        };
        return labels[tagValue] || tagValue;
    }

    // Inicializar contador de etiquetas
    updateTagCount();
    updateStyleTagCount();
});