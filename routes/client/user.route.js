const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/client/uploadCloud.middleware");
const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/register", controller.register);
router.post("/register", userValidate.register, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", userValidate.login, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", userValidate.resetPassword, controller.resetPasswordPost);
router.get("/info", authMiddleware.requireAuth,controller.info);
router.patch("/info", upload.single("avatar"), uploadCloud.upload, authMiddleware.requireAuth, controller.infoPatch);


module.exports = router;