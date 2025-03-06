const express = require('express');
const multer  = require('multer');
const upload = multer();
const router = express.Router();
const validate = require('../../validates/admin/product.validate');
const controller = require("../../controllers/admin/product.controller");
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteProduct);
router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud.upload,validate.createPost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",upload.single('thumbnail'),uploadCloud.upload, validate.createPost, controller.editPost);
router.get("/detail/:id", controller.detail);    
    

module.exports = router;