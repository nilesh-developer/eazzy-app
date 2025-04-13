import { Router } from "express";
import { sendNotificationToCustomers } from "../controllers/notification.controller.js";

const router = Router()

router.route("/send").post(sendNotificationToCustomers)

export { router as notificationRouter }