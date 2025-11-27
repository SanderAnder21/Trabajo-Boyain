import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirs = {
    images: 'uploads/images',
    docs: 'uploads/docs',
    models: 'uploads/models',
    avatars: 'uploads/avatars'
};

Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/';

        if (file.fieldname === 'avatar') {
            uploadPath = uploadDirs.avatars;
        } else if (file.fieldname === 'imagen_principal' || file.fieldname === 'imagenes_galeria') {
            uploadPath = uploadDirs.images;
        } else if (file.fieldname === 'documentos') {
            uploadPath = uploadDirs.docs;
        } else if (file.fieldname === 'modelos3d') {
            uploadPath = uploadDirs.models;
        } else {
            uploadPath = 'uploads/others';
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'imagen_principal' || file.fieldname === 'imagenes_galeria') {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Solo se permiten archivos de imagen!'), false);
        }
    } else if (file.fieldname === 'documentos') {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Solo se permiten archivos PDF!'), false);
        }
    } else if (file.fieldname === 'modelos3d') {
        if (!file.originalname.match(/\.(obj|glb|gltf|fbx|stl)$/)) {
            return cb(new Error('Solo se permiten archivos 3D (.obj, .glb, .gltf, .fbx, .stl)!'), false);
        }
    }
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});