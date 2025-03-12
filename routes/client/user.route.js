const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");


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


module.exports = router;