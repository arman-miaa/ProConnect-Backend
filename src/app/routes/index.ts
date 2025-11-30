import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.route"
import { FollowRoutes } from "../modules/follow/follow.route";

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
    path: "/follow",
    route: FollowRoutes,
  },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})