import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";

const router = Router();
const controller = new UserController();

router.post("/register", validateBody(RegisterDto), controller.register);
router.post("/login", validateBody(LoginDto), controller.login);

router.get("/users", authMiddleware, controller.getAllUsers);
router.get("/users/:id", authMiddleware, controller.getUserById);
router.patch("/users/:id/block", authMiddleware, controller.toggleBlock);

export default router;
