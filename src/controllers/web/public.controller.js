const CategoryService = require("../../services/category.service");
const ContentService = require("../../services/content.service");

class PublicController {
  constructor() {
    this.categoryService = new CategoryService();
    this.contentService = new ContentService();
  }

  home = async (req, res, next) => {
    try {
      const [categories, contents] = await Promise.all([
        this.categoryService.getAllCategory(),
        this.contentService.getAllContent({ status: "published" })
      ]);

      return res.render("home", {
        title: "Home",
        categories,
        contents: contents.slice().reverse().slice(0, 6)
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PublicController;
