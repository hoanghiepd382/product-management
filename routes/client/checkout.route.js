const express = require("express");
const router = express.Router();

const controllerVnpay = require("../../payments/vnpay/payment");
const controller = require("../../controllers/client/checkout.controller")

router.post("/", controller.index);
router.post("/order", controller.order);
router.get("/success/:orderId", controller.success);
router.get("/failed", controller.failed);


module.exports = router;