
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const AppError = require("../utils/AppError");
const Category = require("../models/category.model");

class CategoryService {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/category.json");
    this.contentFilePath = path.join(__dirname, "../../data/content.json");
  }

  getAllCategory() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code === "ENOENT") {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        return [];
      }

      throw new AppError("Unable to read category data.", 500);
    }
  }

  createCategory(name, description, imageurl) {
    const categories = this.getAllCategory();

    const existedCategory = categories.some(
      (item) => item.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existedCategory) {
      throw new AppError("Category name already exists.", 409);
    }

    const id = crypto.randomUUID();

    const category = new Category(
      id,
      name.trim(),
      description.trim(),
      imageurl.trim()
    );

    categories.push(category);

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(categories, null, 2)
    );

    return category;
  }

  getCategoryByID(id) {
    const categories = this.getAllCategory();

    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    return category;
  }

  updateCategory(id, name, description, imageurl) {
    const categories = this.getAllCategory();

    const index = categories.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      throw new AppError("Category not found.", 404);
    }

    const duplicate = categories.some(
      (item) =>
        item.id !== id &&
        item.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
      throw new AppError(
        "Another category already uses this name.",
        409
      );
    }

    categories[index] = {
      ...categories[index],
      name: name.trim(),
      description: description.trim(),
      imageurl: imageurl.trim()
    };

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(categories, null, 2)
    );

    return categories[index];
  }

  deleteCategory(id) {
    const categories = this.getAllCategory();

    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    let contents = [];

    try {
      const data = fs.readFileSync(this.contentFilePath, "utf-8");
      contents = data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw new AppError("Unable to read content data.", 500);
      }
    }

    const hasContent = contents.some(
      (item) => item.categoryId === id
    );

    if (hasContent) {
      throw new AppError(
        "Delete the category's content before deleting the category.",
        409
      );
    }

    const updatedCategories = categories.filter(
      (item) => item.id !== id
    );

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(updatedCategories, null, 2)
    );

    return category;
  }
}

module.exports = CategoryService;
