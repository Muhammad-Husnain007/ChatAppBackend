import { Router } from "express";
import { registerUser, getAllUsers, getByIdUser, deleteUser, getAccessToken, verifyToken
 } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

// router.route("/refresh-token").post(verifyJwt, refreshAccessToken)
router.route('/register').post(registerUser)
router.route('/').get(getAllUsers)
router.route('/:userId').get(getByIdUser)
router.route('/delete/:userId').delete(deleteUser)
router.route('/getAccessToken/:userId').get(getAccessToken)
router.route('/verifyToken').post(verifyToken)

export default router