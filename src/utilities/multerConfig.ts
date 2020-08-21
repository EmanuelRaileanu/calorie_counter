import express from 'express';
import multer, { DiskStorageOptions } from 'multer';
import sjcl from 'sjcl';

const storage = multer.diskStorage({
    destination: (req: express.Request, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req: express.Request, file, cb) => {
        const extensionDotIndex = file.originalname.lastIndexOf('.');
        const extension = file.originalname.substring(extensionDotIndex);
        const bitArray = sjcl.hash.sha256.hash(file.originalname.substring(0, extensionDotIndex));
        const hash = sjcl.codec.hex.fromBits(bitArray);
        cb(null, Date.now() + hash + extension);
    },
});

const upload = multer({storage});

export default upload;