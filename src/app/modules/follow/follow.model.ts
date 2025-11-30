// src/modules/follow/follow.model.ts

import { Schema, model } from "mongoose";
import { IFollow } from "./follow.interface";

const FollowSchema = new Schema<IFollow>(
  {
    follower_id: {
      type: Schema.Types.ObjectId, // ✅ এখানে পরিবর্তন
      required: true,
      ref: "User", // UserModel reference
    },
    following_id: {
      type: Schema.Types.ObjectId, // ✅ এখানে পরিবর্তন
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "follows",
  }
);

// ✅ ডুপ্লিকেট ফলো আটকানোর জন্য unique index
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

export const FollowModel = model<IFollow>("Follow", FollowSchema);
