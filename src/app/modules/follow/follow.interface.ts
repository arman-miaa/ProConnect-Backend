// src/modules/follow/follow.interface.ts

import { Types } from "mongoose";

export interface IFollow {
  // যিনি ফলো করছেন (Follower)
  follower_id: Types.ObjectId;

  // যাকে ফলো করা হচ্ছে (Following)
  following_id: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
