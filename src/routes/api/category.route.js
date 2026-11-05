const express = require("express");
const CategoryControllers = require("../../controllers/api/category.controller");

const router = express.Router();
const categoryController = new CategoryControllers();

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryByID);
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
