const CategoryService = require("../../services/category.service");
const CategoryValidation = require("../../validation/category.validation");

class CategoryControllers {
  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategory = async (req, res) => {
    try {
      const categories = await this.categoryService.getAllCategory();
      return res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        data: categories
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  getCategoryByID = async (req, res) => {
    try {
      const category = await this.categoryService.getCategoryByID(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Category fetched successfully.",
        data: category
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  createCategory = async (req, res) => {
    try {
      const { name, description, imageurl } = req.body;
      CategoryValidation.validate(name, description, imageurl);
      const category = await this.categoryService.createCategory(
        name,
        description,
        imageurl
      );

      return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  updateCategory = async (req, res) => {
    try {
      const { name, description, imageurl } = req.body;
      CategoryValidation.validate(name, description, imageurl);
      const category = await this.categoryService.updateCategory(
        req.params.id,
        name,
        description,
        imageurl
      );

      return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: category
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
        data: null
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };
}

module.exports = CategoryControllers;
