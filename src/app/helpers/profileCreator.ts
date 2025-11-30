/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "../modules/user/user.interface";
import { DoctorProfileModel, ProfileOrganizationModel, ProfilePersonalModel, ProfilePublicFigureModel } from "../modules/user/user.model";

export const createProfileByRole = async (
  role: Role,
  userId: string,
  data: any
) => {
  switch (role) {
    case Role.PERSONAL:
      return await ProfilePersonalModel.create({
        user_id: userId,
        gender: data.gender,
        dob: data.dob,
        blood_group_type: data.blood_group_type,
        weight: data.weight,
        address_district: data.address_district,
        address_thana: data.address_thana,
      });

    case Role.DOCTOR:
      return await DoctorProfileModel.create({
        user_id: userId,
        gender: data.gender,
        dob: data.dob,
        specialization: data.specialization,
        custom_specialization: data.custom_specialization,
        consultation_fee_first: data.consultation_fee_first,
        consultation_fee_followup: data.consultation_fee_followup,
        avg_patient_time: data.avg_patient_time,
        chamber_name: data.chamber_name,
        location_details: data.location_details,
        address_district: data.address_district,
        address_thana: data.address_thana,
      });

    case Role.PUBLIC_FIGURE:
      return await ProfilePublicFigureModel.create({
        user_id: userId,
        gender: data.gender,
        dob: data.dob,
        specialization: data.specialization,
        custom_specialization: data.custom_specialization,
        address_district: data.address_district,
        address_thana: data.address_thana,
      });

    case Role.ORGANIZATION:
      return await ProfileOrganizationModel.create({
        user_id: userId,
        specialization: data.specialization,
        custom_specialization: data.custom_specialization,
        establishment_date: data.establishment_date,
        is_blood_bank: data.is_blood_bank,
        address_district: data.address_district,
        address_thana: data.address_thana,
        license_number: data.license_number,
      });

    default:
      return null;
  }
};
