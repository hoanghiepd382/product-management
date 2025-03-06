const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const accountController = require("../../controllers/admin/account.controller");
const accountValidate = require("../../validates/admin/account.validate");

router.get("/", accountController.index);
router.get("/create", accountController.create);
router.post("/create", upload.single("avatar"), uploadCloud.upload, accountValidate.createAccount, accountController.createPost);
router.get("/edit/:id", accountController.edit);
router.patch("/edit/:id", upload.single("avatar"), uploadCloud.upload, accountValidate.editAccount, accountController.editPatch);

module.exports = router;

