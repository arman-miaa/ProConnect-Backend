import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequrest";
import {  AdminCreateSchema, FinalRegistrationSchema, FinalUpdateSchema,  } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";





const router = Router();


router.post(
  "/register",
  validateRequest(FinalRegistrationSchema),
  UserControllers.createUser
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(AdminCreateSchema),
  UserControllers.createAdmin
);

router.patch(
  "/update-profile",
 
  checkAuth(
    Role.PERSONAL,
    Role.DOCTOR,
    Role.PUBLIC_FIGURE,
    Role.ORGANIZATION,
    Role.SUPER_ADMIN,
    Role.ADMIN
  ),

  validateRequest(FinalUpdateSchema),
  UserControllers.updateUser
);

router.patch(
  "/admin/update-user/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.adminUpdateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN,Role.PERSONAL),
  UserControllers.getAllUsers
);



export const UserRoutes = router