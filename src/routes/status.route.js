import { Router } from "express";
import { deleteStatus, getStatus, uploadStatus } from "../controllers/status.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/uploadStatus').post(
    upload.fields([
        {
            name: 'status',
            maxCount: 1  
        },
        {
            name: 'thumbnail', 
            maxCount: 1  
        }
    ]),
    (req, res, next) => {
        if (!req.files || !req.files.thumbnail) {
            req.files = { ...req.files, thumbnail: [] };
        }
        next();
    },
    uploadStatus
);

router.route('/:userId').get(getStatus);
router.route('/:statusId').delete(deleteStatus);

export default router;
