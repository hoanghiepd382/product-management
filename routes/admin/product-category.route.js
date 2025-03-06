const express = require('express');
const multer  = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const router = express.Router();


const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index); 
router.get("/create", controller.create);
router.post("/create", upload.single("thumbnail"), uploadCloud.upload, controller.postCreate);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.upload, controller.patchEdit);

module.exports = router;