const CategoryService = require("../../services/category.service");
const CategoryValidation = require("../../validation/category.validation");
const ContentService = require("../../services/content.service");

class CategoryWebController {
  constructor() {
    this.categoryService = new CategoryService();
    this.contentService = new ContentService();
  }

  index = async (req, res, next) => {
    try {
      const categories = await this.categoryService.getAllCategory();
      return res.render("category/index", {
        title: "Categories",
        categories
      });
    } catch (error) {
      next(error);
    }
  };

  createForm = (req, res) => {
    return res.render("category/form", {
      title: "Create Category",
      category: {},
      formAction: "/category",
      submitLabel: "Create Category",
      error: null
    });
  };

  create = async (req, res, next) => {
    try {
      const { name, description, imageurl } = req.body;
      CategoryValidation.validate(name, description, imageurl);
      await this.categoryService.createCategory(name, description, imageurl);
      return res.redirect("/category");
    } catch (error) {
      if (error.statusCode && error.statusCode < 500) {
        return res.status(error.statusCode).render("category/form", {
          title: "Create Category",
          category: req.body,
          formAction: "/category",
          submitLabel: "Create Category",
          error: error.message
        });
      }
      next(error);
    }
  };

  editForm = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryByID(req.params.id);
      return res.render("category/form", {
        title: "Edit Category",
        category,
        formAction: `/category/${category.id}?_method=PATCH`,
        submitLabel: "Update Category",
        error: null
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { name, description, imageurl } = req.body;
      CategoryValidation.validate(name, description, imageurl);
      await this.categoryService.updateCategory(
        req.params.id,
        name,
        description,
        imageurl
      );
      return res.redirect("/category");
    } catch (error) {
      if (error.statusCode && error.statusCode < 500) {
        const category = { ...req.body, id: req.params.id };
        return res.status(error.statusCode).render("category/form", {
          title: "Edit Category",
          category,
          formAction: `/category/${req.params.id}?_method=PATCH`,
          submitLabel: "Update Category",
          error: error.message
        });
      }
      next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryByID(req.params.id);
      const contents = await this.contentService.getContentByCategory(category.id);
      const publishedContents = contents.filter((item) => item.status === "published");

      return res.render("category/show", {
        title: category.name,
        category,
        contents: publishedContents
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      return res.redirect("/category");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryWebController;
