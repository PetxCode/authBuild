"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
// AUTH
router.route("/register-account").post(authController_1.createUser);
router.route("/login-account").post(authController_1.logInUser);
router.route("/forget-account-password").post(authController_1.forgetUserPassword);
router.route("/reset-account-password").patch(authController_1.changeUserPassword);
// PROFILE
router.route("/get-account/:userID").get(authController_1.readOneUser);
router.route("/update-account-name/:userID").patch(authController_1.updateOneUserName);
router.route("/update-account-avatar/:userID").patch(authController_1.updateOneUserAvatar);
exports.default = router;
