const express = require("express");
const ContentControllers = require("../../controllers/api/content.controller");

const router = express.Router();
const contentController = new ContentControllers();

router.get("/", contentController.getAllContent);
router.get("/:id", contentController.getContentByID);
router.post("/", contentController.createContent);
router.patch("/:id", contentController.updateContent);
router.delete("/:id", contentController.deleteContent);

module.exports = router;
