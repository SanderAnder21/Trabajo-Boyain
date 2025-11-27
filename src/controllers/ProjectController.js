import database from '../../database.js';

class ProjectController {
    async createProject(req, res) {
        try {
            const userId = req.user.id;
            const {
                titulo,
                descripcion,
                descripcion_completa,
                tipo,
                ubicacion,
                area_construida,
                presupuesto,
                duracion
            } = req.body;

            const files = req.files || {};

            if (!titulo || !descripcion) {
                return res.status(400).json({
                    error: 'El título y la descripción son requeridos'
                });
            }

            console.log('Creando proyecto:', titulo);

            let imagenPrincipalUrl = null;
            if (files['imagen_principal'] && files['imagen_principal'][0]) {
                imagenPrincipalUrl = '/' + files['imagen_principal'][0].path.replace(/\\/g, '/');
            }

            const sql = `
                INSERT INTO proyectos (
                    usuario_id, titulo, descripcion, descripcion_completa,
                    imagen_principal, tipo, ubicacion, area_construida,
                    presupuesto, duracion, fecha_creacion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
            `;

            const [result] = await database.query(sql, [
                userId,
                titulo,
                descripcion,
                descripcion_completa || descripcion,
                imagenPrincipalUrl,
                tipo || 'residencial',
                ubicacion || null,
                area_construida || null,
                presupuesto || null,
                duracion || null
            ]);

            const projectId = result.insertId;

            if (files['imagenes_galeria']) {
                for (let i = 0; i < files['imagenes_galeria'].length; i++) {
                    const file = files['imagenes_galeria'][i];
                    const url = '/' + file.path.replace(/\\/g, '/');

                    const imageSql = `
                        INSERT INTO imagenes_proyecto (proyecto_id, url_imagen, orden)
                        VALUES (?, ?, ?)
                    `;
                    await database.query(imageSql, [projectId, url, i]);
                }
            }

            if (files['documentos']) {
                for (const file of files['documentos']) {
                    const url = '/' + file.path.replace(/\\/g, '/');
                    const fileSql = `
                        INSERT INTO archivos_proyecto (proyecto_id, url_archivo, nombre_archivo, tipo_archivo)
                        VALUES (?, ?, ?, 'pdf')
                    `;
                    await database.query(fileSql, [projectId, url, file.originalname]);
                }
            }

            if (files['modelos3d']) {
                for (const file of files['modelos3d']) {
                    const url = '/' + file.path.replace(/\\/g, '/');
                    const fileSql = `
                        INSERT INTO archivos_proyecto (proyecto_id, url_archivo, nombre_archivo, tipo_archivo)
                        VALUES (?, ?, ?, 'modelo3d')
                    `;
                    await database.query(fileSql, [projectId, url, file.originalname]);
                }
            }

            console.log('Proyecto creado con ID:', projectId);

            res.status(201).json({
                success: true,
                message: 'Proyecto creado exitosamente',
                projectId: projectId
            });

        } catch (error) {
            console.error('Error creando proyecto:', error);
            res.status(500).json({
                error: 'Error al crear el proyecto',
                details: error.message
            });
        }
    }

    async getAllProjects(req, res) {
        try {
            const sql = `
                SELECT 
                    p.*,
                    u.nombre as arquitecto_nombre,
                    u.avatar as arquitecto_avatar,
                    u.especialidad as arquitecto_especialidad
                FROM proyectos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                ORDER BY p.fecha_publicacion DESC
            `;

            const [projects] = await database.query(sql);

            res.json({
                success: true,
                projects: projects
            });

        } catch (error) {
            console.error('Error obteniendo proyectos:', error);
            res.status(500).json({
                error: 'Error al obtener proyectos',
                details: error.message
            });
        }
    }

    async getProjectById(req, res) {
        try {
            const { id } = req.params;

            const sql = `
                SELECT 
                    p.*,
                    u.nombre as arquitecto_nombre,
                    u.avatar as arquitecto_avatar,
                    u.especialidad as arquitecto_especialidad,
                    u.email as arquitecto_email,
                    u.biografia as arquitecto_biografia
                FROM proyectos p
                INNER JOIN usuarios u ON p.usuario_id = u.id
                WHERE p.id = ?
            `;

            const [projects] = await database.query(sql, [id]);

            if (projects.length === 0) {
                return res.status(404).json({
                    error: 'Proyecto no encontrado'
                });
            }

            const imagesSql = `
                SELECT url_imagen, descripcion, orden
                FROM imagenes_proyecto
                WHERE proyecto_id = ?
                ORDER BY orden ASC
            `;

            const [images] = await database.query(imagesSql, [id]);

            const filesSql = `
                SELECT url_archivo, nombre_archivo, tipo_archivo
                FROM archivos_proyecto
                WHERE proyecto_id = ?
            `;
            const [files] = await database.query(filesSql, [id]);

            await database.query(
                'UPDATE proyectos SET total_vistas = total_vistas + 1 WHERE id = ?',
                [id]
            );

            res.json({
                success: true,
                project: {
                    ...projects[0],
                    imagenes_galeria: images,
                    archivos: files
                }
            });

        } catch (error) {
            console.error('Error obteniendo proyecto:', error);
            res.status(500).json({
                error: 'Error al obtener el proyecto',
                details: error.message
            });
        }
    }

    async getUserProjects(req, res) {
        try {
            const userId = req.user.id;

            const sql = `
                SELECT * FROM proyectos
                WHERE usuario_id = ?
                ORDER BY fecha_publicacion DESC
            `;

            const [projects] = await database.query(sql, [userId]);

            res.json({
                success: true,
                projects: projects
            });

        } catch (error) {
            console.error('Error obteniendo proyectos del usuario:', error);
            res.status(500).json({
                error: 'Error al obtener proyectos',
                details: error.message
            });
        }
    }

    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const {
                titulo,
                descripcion,
                descripcion_completa,
                tipo,
                ubicacion,
                area_construida,
                presupuesto,
                duracion
            } = req.body;

            const files = req.files || {};

            const checkSql = 'SELECT usuario_id FROM proyectos WHERE id = ?';
            const [projects] = await database.query(checkSql, [id]);

            if (projects.length === 0) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            if (projects[0].usuario_id !== userId) {
                return res.status(403).json({ error: 'No autorizado para editar este proyecto' });
            }

            let sql = `
                UPDATE proyectos SET
                    titulo = ?,
                    descripcion = ?,
                    descripcion_completa = ?,
                    tipo = ?,
                    ubicacion = ?,
                    area_construida = ?,
                    presupuesto = ?,
                    duracion = ?
            `;

            const params = [
                titulo,
                descripcion,
                descripcion_completa,
                tipo,
                ubicacion,
                area_construida,
                presupuesto,
                duracion
            ];

            if (files['imagen_principal'] && files['imagen_principal'][0]) {
                const url = '/' + files['imagen_principal'][0].path.replace(/\\/g, '/');
                sql += `, imagen_principal = ?`;
                params.push(url);
            }

            sql += ` WHERE id = ?`;
            params.push(id);

            await database.query(sql, params);
            
            if (files['imagenes_galeria']) {
                const [maxOrderResult] = await database.query('SELECT MAX(orden) as maxOrder FROM imagenes_proyecto WHERE proyecto_id = ?', [id]);
                let currentOrder = (maxOrderResult[0].maxOrder || 0) + 1;

                for (const file of files['imagenes_galeria']) {
                    const url = '/' + file.path.replace(/\\/g, '/');
                    const imageSql = `INSERT INTO imagenes_proyecto (proyecto_id, url_imagen, orden) VALUES (?, ?, ?)`;
                    await database.query(imageSql, [id, url, currentOrder++]);
                }
            }

            if (files['documentos']) {
                for (const file of files['documentos']) {
                    const url = '/' + file.path.replace(/\\/g, '/');
                    const fileSql = `INSERT INTO archivos_proyecto (proyecto_id, url_archivo, nombre_archivo, tipo_archivo) VALUES (?, ?, ?, 'pdf')`;
                    await database.query(fileSql, [id, url, file.originalname]);
                }
            }

            if (files['modelos3d']) {
                for (const file of files['modelos3d']) {
                    const url = '/' + file.path.replace(/\\/g, '/');
                    const fileSql = `INSERT INTO archivos_proyecto (proyecto_id, url_archivo, nombre_archivo, tipo_archivo) VALUES (?, ?, ?, 'modelo3d')`;
                    await database.query(fileSql, [id, url, file.originalname]);
                }
            }

            res.json({
                success: true,
                message: 'Proyecto actualizado exitosamente'
            });

        } catch (error) {
            console.error('Error actualizando proyecto:', error);
            res.status(500).json({
                error: 'Error al actualizar el proyecto',
                details: error.message
            });
        }
    }

    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const checkSql = 'SELECT usuario_id FROM proyectos WHERE id = ?';
            const [projects] = await database.query(checkSql, [id]);

            if (projects.length === 0) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            if (projects[0].usuario_id !== userId) {
                return res.status(403).json({ error: 'No autorizado para eliminar este proyecto' });
            }

            await database.query('DELETE FROM proyectos WHERE id = ?', [id]);

            res.json({
                success: true,
                message: 'Proyecto eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error eliminando proyecto:', error);
            res.status(500).json({
                error: 'Error al eliminar el proyecto',
                details: error.message
            });
        }
    }

    async getArchitects(req, res) {
        try {
            const sql = `
                SELECT DISTINCT 
                    u.id,
                    u.nombre as name,
                    u.avatar,
                    u.especialidad as specialty,
                    u.biografia as bio,
                    COUNT(p.id) as total_projects
                FROM usuarios u
                INNER JOIN proyectos p ON u.id = p.usuario_id
                WHERE u.es_arquitecto = 1
                GROUP BY u.id, u.nombre, u.avatar, u.especialidad, u.biografia
                ORDER BY u.nombre ASC
            `;

            const [architects] = await database.query(sql);

            res.json({
                success: true,
                architects: architects
            });

        } catch (error) {
            console.error('Error obteniendo arquitectos:', error);
            res.status(500).json({
                error: 'Error al obtener arquitectos',
                details: error.message
            });
        }
    }
}

export default new ProjectController();