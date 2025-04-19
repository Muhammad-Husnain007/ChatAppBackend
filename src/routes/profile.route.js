import { Router } from "express";
import { receiveContactsProfile, receiveDP, receiveProfile, Uploadprofile } from "../controllers/profile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
// router.use(verifyJwt);

router.route('/upload/:userId').post(
    upload.fields([
        {
            name: "profile",
            maxCount: 1,
        },
    ]), Uploadprofile
);
router.route('/receive/:profileId').get(receiveProfile);
router.route('/receiveByUserId/:userId').get(receiveDP);
router.route('/receiveContactsProfiles/:userId').get(receiveContactsProfile);


export default router;
