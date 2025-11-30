"use strict";
// modules/user/user.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationType = exports.PublicFigureType = exports.DoctorType = exports.BloodGroupType = exports.Gender = exports.IsActiv = exports.Role = exports.VerificationStatus = void 0;
// --- নতুন ENUMS: ভেরিফিকেশন ও সোশ্যাল লিঙ্কস ---
var VerificationStatus;
(function (VerificationStatus) {
    VerificationStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    VerificationStatus["PENDING"] = "PENDING";
    VerificationStatus["APPROVED"] = "APPROVED";
    VerificationStatus["REJECTED"] = "REJECTED";
})(VerificationStatus || (exports.VerificationStatus = VerificationStatus = {}));
// --- কোর ENUMS (কোর ডেটা ও রোল) ---
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["PERSONAL"] = "PERSONAL";
    Role["DOCTOR"] = "DOCTOR";
    Role["PUBLIC_FIGURE"] = "PUBLIC_FIGURE";
    Role["ORGANIZATION"] = "ORGANIZATION";
})(Role || (exports.Role = Role = {}));
var IsActiv;
(function (IsActiv) {
    IsActiv["ACTIVE"] = "ACTIVE";
    IsActiv["INACTIVE"] = "INACTIVE";
    IsActiv["BLOCKED"] = "BLOCKED";
})(IsActiv || (exports.IsActiv = IsActiv = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
})(Gender || (exports.Gender = Gender = {}));
var BloodGroupType;
(function (BloodGroupType) {
    BloodGroupType["APositive"] = "A+";
    BloodGroupType["ANegative"] = "A-";
    BloodGroupType["BPositive"] = "B+";
    BloodGroupType["BNegative"] = "B-";
    BloodGroupType["ABPositive"] = "AB+";
    BloodGroupType["ABNegative"] = "AB-";
    BloodGroupType["OPositive"] = "O+";
    BloodGroupType["ONegative"] = "O-";
})(BloodGroupType || (exports.BloodGroupType = BloodGroupType = {}));
// --- 🎯 ইউজার রোল-ভিত্তিক ENUMS (সম্পূর্ণ তালিকা সহ) ---
var DoctorType;
(function (DoctorType) {
    DoctorType["MEDICINE"] = "Medicine";
    DoctorType["CHILD_SPECIALIST"] = "Child Specialist";
    DoctorType["GYNECOLOGY"] = "Gynecology";
    DoctorType["HEART_SPECIALIST"] = "Heart Specialist";
    DoctorType["NEURO_SPECIALIST"] = "Neuro Specialist";
    DoctorType["ORTHOPEDIC"] = "Orthopedic";
    DoctorType["SKIN_SEX"] = "Skin & Sex";
    DoctorType["EYE_SPECIALIST"] = "Eye Specialist";
    DoctorType["ENT_SPECIALIST"] = "ENT Specialist";
    DoctorType["DENTAL"] = "Dental";
    DoctorType["MENTAL_HEALTH"] = "Mental Health";
    DoctorType["KIDNEY"] = "Kidney";
    DoctorType["STOMACH_LIVER"] = "Stomach & Liver";
    DoctorType["DIABETES_HORMONE"] = "Diabetes & Hormone";
    DoctorType["CANCER"] = "Cancer";
    DoctorType["CHEST_ASTHMA"] = "Chest & Asthma";
    DoctorType["SURGERY"] = "Surgery";
    DoctorType["PATHOLOGY"] = "Pathology";
    DoctorType["RADIOLOGY"] = "Radiology";
    DoctorType["EMERGENCY"] = "Emergency";
    DoctorType["OTHER"] = "Other";
})(DoctorType || (exports.DoctorType = DoctorType = {}));
var PublicFigureType;
(function (PublicFigureType) {
    PublicFigureType["SOCIAL_WORKER"] = "Social Worker";
    PublicFigureType["ACTOR"] = "Actor";
    PublicFigureType["SINGER"] = "Singer";
    PublicFigureType["SPORTS_PERSONALITY"] = "Sports Personality";
    PublicFigureType["JOURNALIST"] = "Journalist";
    PublicFigureType["CONTENT_CREATOR"] = "Content Creator";
    PublicFigureType["POLITICIAN"] = "Politician";
    PublicFigureType["BUSINESSPERSON"] = "Businessperson";
    PublicFigureType["OTHER"] = "Other";
})(PublicFigureType || (exports.PublicFigureType = PublicFigureType = {}));
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["RELIGIOUS"] = "Religious Organization";
    OrganizationType["ORPHANAGE"] = "Orphanage";
    OrganizationType["OLD_AGE_HOME"] = "Old Age Home";
    OrganizationType["FOUNDATION"] = "Foundation";
    OrganizationType["DISABILITY_SUPPORT"] = "Disability Support Organization";
    OrganizationType["FOOD_AID"] = "Food Aid Agency";
    OrganizationType["HOSPITAL"] = "Hospital";
    OrganizationType["RELIEF"] = "Relief Organization";
    OrganizationType["SOCIAL_WELFARE"] = "Social Welfare Organization";
    OrganizationType["RESEARCH_INSTITUTE"] = "Research Institute";
    OrganizationType["OTHER"] = "Other";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
