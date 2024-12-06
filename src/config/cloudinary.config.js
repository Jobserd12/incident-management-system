import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import Boom from '@hapi/boom';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'helpdesk-system/incidents',
        allowed_formats: ['jpg', 'png', 'pdf', 'gif', 'webp'],
        resource_type: 'auto',
        transformation: [
            { quality: 'auto:good' },
            { flags: 'preserve_transparency' }, 
            { fetch_format: 'auto' },     
        ],
        eager: [
            {
                quality: 'auto:good',
                fetch_format: 'auto',
            }
        ],
        format: 'auto'
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(Boom.badRequest('Tipo de archivo no soportado'));
    }
};

// Crear la instancia base de multer
const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: fileFilter
});

// Exportar las funciones específicas
export const upload = {
    array: uploadMiddleware.array.bind(uploadMiddleware),
    single: uploadMiddleware.single.bind(uploadMiddleware)
};

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_COUNT') {
            return next(Boom.badRequest('No se pueden subir más de 5 archivos'));
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(Boom.badRequest('El archivo excede el tamaño máximo permitido de 10MB'));
        }
    }
    next(err);
};

export const cloudinaryService = cloudinary; 