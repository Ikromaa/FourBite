import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { createItem, getItems, deleteItem, updateItemPrice } from '../controllers/itemController.js';
import adminAuth from '../middleware/adminAuth.js';

const itemRouter = express.Router();

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (allowedImageTypes.has(file.mimetype)) {
            cb(null, true);
            return;
        }
        cb(new Error('Format gambar harus jpg, jpeg, png, atau webp.'));
    },
});

const uploadMenuImage = async (req, _res, next) => {
    if (!req.file) {
        next();
        return;
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'fourbite-menu', resource_type: 'image' },
                (error, uploadedImage) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(uploadedImage);
                }
            );

            stream.end(req.file.buffer);
        });

        req.file.path = result.secure_url;
        req.file.filename = result.public_id;
        next();
    } catch (error) {
        next(error);
    }
};

itemRouter.post('/', adminAuth, upload.single('image'), uploadMenuImage, createItem);
itemRouter.get('/', getItems);
itemRouter.delete('/:id', adminAuth, deleteItem);
itemRouter.patch('/:id/price', adminAuth, updateItemPrice);

export default itemRouter;
