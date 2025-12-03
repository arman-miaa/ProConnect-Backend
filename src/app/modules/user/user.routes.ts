import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequrest";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { registerSchema, updateUserSchema } from "./user.validation";
import { multerUpload } from "../../config/multer.config";





const router = Router();


router.post(
  "/register",
  validateRequest(registerSchema),
  UserControllers.createUser
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN),
  // validateRequest(AdminCreateSchema),
  UserControllers.createAdmin
);

router.patch(
  "/update-profile",

  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(updateUserSchema),
  UserControllers.updateUser
);

router.patch(
  "/admin/update-user/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.adminUpdateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);



export const UserRoutes = router