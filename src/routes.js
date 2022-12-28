import { Router } from "express";
import TelegramController from "./app/controllers/TelegramController.js";
import UserController from "./app/controllers/UserController.js";
import WorkController from "./app/controllers/WorkController.js";

const router = Router();

router.get("/users", UserController.index);
router.get("/users/:id", UserController.show);
router.post("/users", UserController.store);
router.put("/users/:id", UserController.update);
router.delete("/users/:id", UserController.delete);

router.get("/works", WorkController.index);
router.get("/works/:id", WorkController.show);
router.post("/works", WorkController.store);
router.put("/works/:id", WorkController.update);
router.delete("/works/:id", WorkController.delete);

router.post("/activate", TelegramController.activate);

export default router;
