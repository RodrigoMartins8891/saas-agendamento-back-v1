import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

/* 🔧 CONFIG CLOUDINARY */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* 📦 STORAGE */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'sass-agendamento/medicos', // Atualizei a pasta para o seu novo projeto!
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const uploadCloud = multer({ storage });


export default uploadCloud;