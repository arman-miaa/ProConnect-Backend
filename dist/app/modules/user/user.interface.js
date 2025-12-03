"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActiv = exports.Role = void 0;
// Role এনুম (Enum) নির্ধারণ
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["CLIENT"] = "CLIENT";
    Role["SELLER"] = "SELLER";
})(Role || (exports.Role = Role = {}));
var IsActiv;
(function (IsActiv) {
    IsActiv["ACTIVE"] = "ACTIVE";
    IsActiv["INACTIVE"] = "INACTIVE";
    IsActiv["BLOCKED"] = "BLOCKED";
})(IsActiv || (exports.IsActiv = IsActiv = {}));
