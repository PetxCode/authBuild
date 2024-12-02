import { Router } from "express";
import {
  changeUserPassword,
  createUser,
  forgetUserPassword,
  logInUser,
  readOneUser,
  updateOneUserAvatar,
  updateOneUserName,
  verifyUserAccount,
} from "../controller/authController";
import { upload } from "../utils/multer";

const router: any = Router();

// AUTH
router.route("/register-account").post(createUser);
router.route("/login-account").post(logInUser);
router.route("/forget-account-password").post(forgetUserPassword);
router.route("/reset-account-password").patch(changeUserPassword);
router.route("/verify-account/:userID").get(verifyUserAccount);

// PROFILE
router.route("/get-account/:userID").get(readOneUser);
router.route("/update-account-name/:userID").patch(updateOneUserName);
router
  .route("/update-account-avatar/:userID")
  .patch(upload, updateOneUserAvatar);

export default router;
