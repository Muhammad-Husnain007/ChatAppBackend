import { Router } from "express";
import { importNotSaved } from "../controllers/contactNotSaved.controller.js";

const router = Router();

router.route('/contactNotSaved/:userId').get(importNotSaved)


export default router