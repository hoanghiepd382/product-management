const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/product.controller");

router.get('/', controller.index);
router.get('/:categorySlug', controller.getProductCategory);
router.get('/detail/:productSlug', controller.detail);
router.post('/:productSlug/review', controller.review);


module.exports = router;