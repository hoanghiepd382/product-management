const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/blog.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single("thumbnail"), uploadCloud.upload, controller.createPost);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.upload, controller.editPatch);
router.get("/delete/:id", controller.delete);
router.get("/status/:id/:status", controller.status);

module.exports = router;