const AppError = require("../utils/AppError");

class CategoryValidation {
  static validateName(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new AppError("Category name is required.", 400);
    }
    if (name.trim().length < 3) {
      throw new AppError("Category name must be at least 3 characters.", 400);
    }
  }

  static validateDescription(description) {
    if (typeof description !== "string" || !description.trim()) {
      throw new AppError("Category description is required.", 400);
    }
    if (description.trim().length < 3) {
      throw new AppError("Description must be at least 3 characters.", 400);
    }
  }

  static validateImage(imageurl) {
    if (typeof imageurl !== "string" || !imageurl.trim()) {
      throw new AppError("Category image URL is required.", 400);
    }
    try {
      const parsed = new URL(imageurl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      throw new AppError("Please provide a valid HTTP or HTTPS image URL.", 400);
    }
  }

  static validate(name, description, imageurl) {
    this.validateName(name);
    this.validateDescription(description);
    this.validateImage(imageurl);
    return true;
  }
}

module.exports = CategoryValidation;
