import { Router } from "express";
import { deleteMessage, getByIdMessage, receiveMessage, sendMessage, updateMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/send/:chatId").post(
    upload.fields([
        { 
          name: 'media',
          maxCount: 1,
         }
    ]), sendMessage
);
router.route("/receive/:chatId").get(receiveMessage)
router.route("/update/:messageId").put(updateMessage)
router.route("/getById/:messageId").get(getByIdMessage)
router.route("/delete/:messageId").delete(deleteMessage)

export default router