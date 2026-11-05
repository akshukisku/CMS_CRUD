const express = require("express");
const ContentWebController = require("../../controllers/web/content.controller");

const router = express.Router();
const controller = new ContentWebController();

router.get("/", controller.index);
router.get("/create", controller.createForm);
router.post("/", controller.create);
router.get("/:id/edit", controller.editForm);
router.get("/:id", controller.show);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
