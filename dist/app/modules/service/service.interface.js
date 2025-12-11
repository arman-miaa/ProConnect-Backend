"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategory = exports.ServiceStatus = void 0;
// =======================================================
// ১. 🛠️ সার্ভিস স্ট্যাটাস এনুম
// =======================================================
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["LIVE"] = "LIVE";
    ServiceStatus["DRAFT"] = "DRAFT";
    ServiceStatus["PAUSED"] = "PAUSED";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
// =======================================================
// ২. 💻 সার্ভিস ক্যাটাগরি এনুম (এখানে আপনি আপনার অনুমোদিত তালিকা রাখবেন)
// =======================================================
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["WEB_DEVELOPMENT"] = "Web Development";
    ServiceCategory["UI_UX_DESIGN"] = "UI/UX Design";
    ServiceCategory["DIGITAL_MARKETING"] = "Digital Marketing";
    ServiceCategory["SOFTWARE_TESTING"] = "Software Testing";
    ServiceCategory["CONTENT_WRITING"] = "Content Writing";
    ServiceCategory["CYBER_SECURITY"] = "Cyber Security";
    ServiceCategory["MOBILE_DEVELOPMENT"] = "Mobile App Development";
    ServiceCategory["DATA_SCIENCE"] = "Data Science & AI";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
