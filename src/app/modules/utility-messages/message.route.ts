import { Router } from "express";
import { MessageControllers } from "./message.controller";



const router = Router();

router.post(
  "/message",
 
MessageControllers.createMessage
);


export const MessageRoutes = router;
