
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const AppError = require("../utils/AppError");
const Content = require("../models/content.model");
const CategoryService = require("./category.service");

class ContentService {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/content.json");
    this.categoryService = new CategoryService();
  }

  getAllContent = (filters = {}) => {
    let contents = [];

    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      contents = data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code === "ENOENT") {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        return [];
      }

      throw new AppError("Unable to read content data.", 500);
    }

    if (filters.categoryId) {
      contents = contents.filter(
        (item) => item.categoryId === filters.categoryId
      );
    }

    if (filters.status) {
      contents = contents.filter(
        (item) => item.status === filters.status
      );
    }

    return contents;
  };

  getContentByID = (id) => {
    const contents = this.getAllContent();

    const content = contents.find(
      (item) => item.id === id
    );

    if (!content) {
      throw new AppError("Content not found.", 404);
    }

    return content;
  };

  getContentByCategory = (categoryId) => {
    const contents = this.getAllContent();

    return contents.filter(
      (item) => item.categoryId === categoryId
    );
  };

  createContent = (payload) => {
    this.categoryService.getCategoryByID(payload.categoryId);

    const contents = this.getAllContent();

    const duplicate = contents.some(
      (item) =>
        item.title.toLowerCase() === payload.title.trim().toLowerCase()
    );

    if (duplicate) {
      throw new AppError("Content title already exists.", 409);
    }

    const id = crypto.randomUUID();

    const content = new Content(
      id,
      payload.categoryId,
      payload.title,
      payload.description,
      payload.body,
      payload.thumbnail || "",
      payload.status || "draft"
    );

    contents.push(content);

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(contents, null, 2)
    );

    return content;
  };

  updateContent = (id, payload) => {
    const contents = this.getAllContent();

    const index = contents.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      throw new AppError("Content not found.", 404);
    }

    this.categoryService.getCategoryByID(payload.categoryId);

    const duplicate = contents.some(
      (item) =>
        item.id !== id &&
        item.title.toLowerCase() === payload.title.trim().toLowerCase()
    );

    if (duplicate) {
      throw new AppError(
        "Another content already uses this title.",
        409
      );
    }

    contents[index] = {
      ...contents[index],
      categoryId: payload.categoryId,
      title: payload.title.trim(),
      description: payload.description.trim(),
      body: payload.body.trim(),
      thumbnail: (payload.thumbnail || "").trim(),
      status: payload.status || "draft",
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(contents, null, 2)
    );

    return contents[index];
  };

  deleteContent = (id) => {
    const contents = this.getAllContent();

    const content = contents.find(
      (item) => item.id === id
    );

    if (!content) {
      throw new AppError("Content not found.", 404);
    }

    const updatedContents = contents.filter(
      (item) => item.id !== id
    );

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(updatedContents, null, 2)
    );

    return content;
  };
}

module.exports = ContentService;