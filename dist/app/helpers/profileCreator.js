"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileByRole = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const createProfileByRole = (role, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    switch (role) {
        case user_interface_1.Role.PERSONAL:
            return yield user_model_1.ProfilePersonalModel.create({
                user_id: userId,
                gender: data.gender,
                dob: data.dob,
                blood_group_type: data.blood_group_type,
                weight: data.weight,
                address_district: data.address_district,
                address_thana: data.address_thana,
            });
        case user_interface_1.Role.DOCTOR:
            return yield user_model_1.DoctorProfileModel.create({
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
        case user_interface_1.Role.PUBLIC_FIGURE:
            return yield user_model_1.ProfilePublicFigureModel.create({
                user_id: userId,
                gender: data.gender,
                dob: data.dob,
                specialization: data.specialization,
                custom_specialization: data.custom_specialization,
                address_district: data.address_district,
                address_thana: data.address_thana,
            });
        case user_interface_1.Role.ORGANIZATION:
            return yield user_model_1.ProfileOrganizationModel.create({
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
});
exports.createProfileByRole = createProfileByRole;
