const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client//home.controller");
const header = require("../../middlewares/client/search-header.middleware");


router.get('/', header.searchForm, controller.index);

module.exports = router;