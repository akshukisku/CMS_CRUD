const ContentService = require("../../services/content.service");
const ContentValidation = require("../../validation/content.validation");
const CategoryService = require("../../services/category.service");

class ContentWebController {
  constructor() {
    this.contentService = new ContentService();
    this.categoryService = new CategoryService();
  }

  index = async (req, res, next) => {
    try {
      const [contents, categories] = await Promise.all([
        this.contentService.getAllContent(),
        this.categoryService.getAllCategory()
      ]);

      const categoryMap = Object.fromEntries(
        categories.map((category) => [category.id, category])
      );

      return res.render("content/index", {
        title: "Manage Content",
        contents,
        categoryMap
      });
    } catch (error) {
      next(error);
    }
  };

  createForm = async (req, res, next) => {
    try {
      const categories = await this.categoryService.getAllCategory();
      return res.render("content/form", {
        title: "Create Content",
        item: { status: "draft" },
        categories,
        formAction: "/content",
        submitLabel: "Create Content",
        error: null
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      ContentValidation.validate(req.body);
      await this.contentService.createContent(req.body);
      return res.redirect("/content");
    } catch (error) {
      if (error.statusCode && error.statusCode < 500) {
        const categories = await this.categoryService.getAllCategory();
        return res.status(error.statusCode).render("content/form", {
          title: "Create Content",
          item: req.body,
          categories,
          formAction: "/content",
          submitLabel: "Create Content",
          error: error.message
        });
      }
      next(error);
    }
  };

  editForm = async (req, res, next) => {
    try {
      const [item, categories] = await Promise.all([
        this.contentService.getContentByID(req.params.id),
        this.categoryService.getAllCategory()
      ]);

      return res.render("content/form", {
        title: "Edit Content",
        item,
        categories,
        formAction: `/content/${item.id}?_method=PATCH`,
        submitLabel: "Update Content",
        error: null
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      ContentValidation.validate(req.body);
      await this.contentService.updateContent(req.params.id, req.body);
      return res.redirect("/content");
    } catch (error) {
      if (error.statusCode && error.statusCode < 500) {
        const [categories, existing] = await Promise.all([
          this.categoryService.getAllCategory(),
          this.contentService.getContentByID(req.params.id)
        ]);
        return res.status(error.statusCode).render("content/form", {
          title: "Edit Content",
          item: { ...existing, ...req.body },
          categories,
          formAction: `/content/${req.params.id}?_method=PATCH`,
          submitLabel: "Update Content",
          error: error.message
        });
      }
      next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      const item = await this.contentService.getContentByID(req.params.id);
      if (item.status !== "published") {
        return res.status(404).render("errors/404", {
          title: "Content not found"
        });
      }

      const category = await this.categoryService.getCategoryByID(item.categoryId);
      return res.render("content/show", {
        title: item.title,
        item,
        category
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.contentService.deleteContent(req.params.id);
      return res.redirect("/content");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ContentWebController;
