/* eslint-disable @typescript-eslint/no-explicit-any */


import { Model } from "mongoose";
import { Role } from "../modules/user/user.interface";
import { DoctorProfileModel, ProfileOrganizationModel, ProfilePersonalModel, ProfilePublicFigureModel } from "../modules/user/user.model";



const getProfileModel = (role: Role): Model<any> | null => {
  switch (role) {
    case Role.PERSONAL:
      return ProfilePersonalModel;
    case Role.DOCTOR:
      return DoctorProfileModel;
    case Role.PUBLIC_FIGURE:
      return ProfilePublicFigureModel;
    case Role.ORGANIZATION:
      return ProfileOrganizationModel;
    default:
      return null;
  }
};

export const updateProfileByRole = async (
  role: Role,
  profileRefId: string,
  updateData: any
) => {
  const ProfileModel = getProfileModel(role);

  if (ProfileModel) {
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      profileRefId,
      updateData,
      { new: true, runValidators: true } // নতুন ডেটা ফেরত দিন এবং ভ্যালিডেটর চালান
    );
    return updatedProfile;
  }

  // যদি ADMIN বা অন্য কোনো রোল যার প্রোফাইল নেই, তবে শুধু null ফেরত দিন
  return null;
};
