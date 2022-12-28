import { Router } from "express";
import TelegramController from "./app/controllers/TelegramController.js";
import UserController from "./app/controllers/UserController.js";
import WorkController from "./app/controllers/WorkController.js";

const router = Router();

router.get("/api/users", UserController.index);
router.get("/api/users/:id", UserController.show);
router.post("/api/users", UserController.store);
router.put("/api/users/:id", UserController.update);
router.delete("/api/users/:id", UserController.delete);

router.get("/api/works", WorkController.index);
router.get("/api/works/:id", WorkController.show);
router.post("/api/works", WorkController.store);
router.put("/api/works/:id", WorkController.update);
router.delete("/api/works/:id", WorkController.delete);

router.post("/activate", TelegramController.activate);

export default router;
