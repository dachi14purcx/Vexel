import { authMiddleware } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/users.controller.js";
import { Router } from "express";

const UserRouter = Router()

UserRouter.get("/me/profile", authMiddleware, UserController.getAuthenticatedUserProfile);
UserRouter.post("/me/avatar/presign", authMiddleware, UserController.getAvatarPresignedUrl);
UserRouter.post("/me/banner/presign", authMiddleware, UserController.getBannerPresignedUrl);
UserRouter.post("/me/avatar", authMiddleware, UserController.saveAvatar);
UserRouter.post("/me/banner", authMiddleware, UserController.saveBanner);
UserRouter.put("/me/profile", authMiddleware, UserController.saveProfile);

export default UserRouter