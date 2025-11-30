// src/modules/follow/follow.route.ts

import { Router } from "express";
import { FollowControllers } from "./follow.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
// import auth from '../../middlewares/auth'; // প্রমাণীকরণের জন্য

const router = Router();

// 1. Follow User
// রুট: POST /api/v1/follows
// রিকোয়েস্ট বডি: { followingId: string }
router.post(
  "/:followingId",
    checkAuth(
      Role.PERSONAL,
      Role.DOCTOR,
      Role.PUBLIC_FIGURE,
      Role.ORGANIZATION,
      Role.SUPER_ADMIN,
      Role.ADMIN
    ),
  FollowControllers.createFollow
);

// 2. Unfollow User
// রুট: DELETE /api/v1/follows/:followingId
// প্যারামিটার: যাকে আনফলো করা হবে
router.delete(
  "/:followingId",
  checkAuth(
    Role.PERSONAL,
    Role.DOCTOR,
    Role.PUBLIC_FIGURE,
    Role.ORGANIZATION,
    Role.SUPER_ADMIN,
    Role.ADMIN
  ),
  FollowControllers.deleteFollow
);

// 3. Get Followers List of a User
// রুট: GET /api/v1/follows/followers/:userId
router.get("/followers",  checkAuth(
    Role.PERSONAL,
    Role.DOCTOR,
    Role.PUBLIC_FIGURE,
    Role.ORGANIZATION,
    Role.SUPER_ADMIN,
    Role.ADMIN
  ), FollowControllers.getFollowers);

// 4. Get Following List of a User
// রুট: GET /api/v1/follows/following/:userId
router.get("/following",  checkAuth(
    Role.PERSONAL,
    Role.DOCTOR,
    Role.PUBLIC_FIGURE,
    Role.ORGANIZATION,
    Role.SUPER_ADMIN,
    Role.ADMIN
  ), FollowControllers.getFollowing);

export const FollowRoutes = router;
