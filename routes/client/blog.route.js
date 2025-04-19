const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/blog.controller");

router.get("/", controller.index);
router.get("/:slugTopic", controller.topics);
router.get("/detail/:slugBlog", controller.detail);


module.exports = router;