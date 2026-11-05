const { randomUUID } = require("crypto");

class Category {
  constructor(name, description, imageurl) {
    this.id = randomUUID();
    this.name = name.trim();
    this.description = description.trim();
    this.imageurl = imageurl.trim();
    this.createdAt = new Date().toISOString();
  }
}

module.exports = Category;
