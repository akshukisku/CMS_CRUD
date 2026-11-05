const AppError = require("../utils/AppError");

class ContentValidation {
  static validate(payload) {
    const { categoryId, title, description, body, status } = payload;

    if (!categoryId || typeof categoryId !== "string") {
      throw new AppError("Please select a category.", 400);
    }
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      throw new AppError("Title is required and must be at least 3 characters.", 400);
    }
    if (!description || typeof description !== "string" || description.trim().length < 3) {
      throw new AppError("Description is required and must be at least 3 characters.", 400);
    }
    if (!body || typeof body !== "string" || body.trim().length < 10) {
      throw new AppError("Content body is required and must be at least 10 characters.", 400);
    }
    if (status && !["draft", "published"].includes(status)) {
      throw new AppError("Status must be either draft or published.", 400);
    }

    if (payload.thumbnail) {
      try {
        const parsed = new URL(payload.thumbnail);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        throw new AppError("Thumbnail must be a valid HTTP or HTTPS URL.", 400);
      }
    }

    return true;
  }
}

module.exports = ContentValidation;
