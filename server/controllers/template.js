import Template from '../models/Template.js';
import User from './../models/User.js';

export const templatePost = async (req, res) => {
  try {
    const { templateName, templateId, template } = req.body;
    const { userId } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.json({
        success: false,
        message: 'Access denied. Only admins can create templates.',
      });
    }

    const existingTemplate = await Template.findOne({ templateId });

    if (existingTemplate) {
      return res.json({
        success: false,
        message: 'Template already exists',
      });
    }

    const newTemplate = new Template({
      templateName,
      templateId,
      template,
    });

    const savedTemplate = await newTemplate.save();

    return res.json({
      success: true,
      message: 'Template created successfully',
      data: savedTemplate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the template',
      error: error.message,
    });
  }
};

export const getTemplate = async (req, res) => {
  try {
    const { templateId } = req.query;

    const template = await Template.findOne({ templateId });

    if (!template) {
      return res.json({
        success: false,
        message: 'No Template Found',
      });
    }

    return res.json({
      success: true,
      message: 'Template fetched successfully',
      data: template,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the template',
      error: error.message,
    });
  }
};

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.json({
      success: true,
      message: 'Templates fetched successfully',
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching templates',
      error: error.message,
    });
  }
};

export const deleteTemplate = async (req, res) => {
  const { templateId } = req.body;
  const { userId } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    return res.json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.role !== 'admin') {
    return res.json({
      success: false,
      message: 'Access denied. Only admins can delete templates.',
    });
  }

  try {
    const template = await Template.findOneAndDelete({ templateId });

    if (!template) {
      return res.json({
        success: false,
        message: 'Template not found',
      });
    }

    res.json({
      success: true,
      message: 'Template deleted successfully',
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the template',
      error: error.message,
    });
  }
};
