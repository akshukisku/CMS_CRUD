const { randomUUID } = require("crypto");

class Content {
  constructor(categoryId, title, description, body, thumbnail, status) {
    const now = new Date().toISOString();

    this.id = randomUUID();
    this.categoryId = categoryId;
    this.title = title.trim();
    this.description = description.trim();
    this.body = body.trim();
    this.thumbnail = (thumbnail || "").trim();
    this.status = status || "draft";
    this.createdAt = now;
    this.updatedAt = now;
  }
}

module.exports = Content;
