import { Router } from "express";
import { notificationController } from "../controllers/notificationController.js";

const notifRouter = Router();

notifRouter.get("/user/:userId", notificationController.getUserNotifications);
notifRouter.patch("/:id/read", notificationController.markAsRead);

export default notifRouter;
