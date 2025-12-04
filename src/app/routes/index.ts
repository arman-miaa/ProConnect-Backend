import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.route"
import { MessageRoutes } from "../modules/utility-messages/message.route";
import { ServiceRoutes } from "../modules/service/service.routes";

export const router = Router()
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/service",
    route: ServiceRoutes,
  },
  {
    path: "/",
    route: MessageRoutes,
  },

];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})