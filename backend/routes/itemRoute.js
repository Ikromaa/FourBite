import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createItem, getItems, deleteItem } from '../controllers/itemController.js';
import adminAuth from '../middleware/adminAuth.js';

const itemRouter = express.Router();

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MULTER STORAGE → CLOUDINARY
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fourbite-menu',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const upload = multer({ storage });

itemRouter.post('/', adminAuth, upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.delete('/:id', adminAuth, deleteItem);

export default itemRouter;