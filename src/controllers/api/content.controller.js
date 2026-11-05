const ContentService = require("../../services/content.service");
const ContentValidation = require("../../validation/content.validation");

class ContentControllers {
  constructor() {
    this.contentService = new ContentService();
  }

  getAllContent = async (req, res) => {
    try {
      const contents = await this.contentService.getAllContent({
        categoryId: req.query.categoryId,
        status: req.query.status
      });
      return res.status(200).json({
        success: true,
        message: "Content fetched successfully.",
        data: contents
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  getContentByID = async (req, res) => {
    try {
      const content = await this.contentService.getContentByID(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Content fetched successfully.",
        data: content
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  createContent = async (req, res) => {
    try {
      ContentValidation.validate(req.body);
      const content = await this.contentService.createContent(req.body);
      return res.status(201).json({
        success: true,
        message: "Content created successfully.",
        data: content
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  updateContent = async (req, res) => {
    try {
      ContentValidation.validate(req.body);
      const content = await this.contentService.updateContent(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: "Content updated successfully.",
        data: content
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  deleteContent = async (req, res) => {
    try {
      await this.contentService.deleteContent(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Content deleted successfully.",
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

module.exports = ContentControllers;
