const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow(null, "").max(1000),
  project_id: Joi.string().guid({ version: "uuidv4" }).required(),
  assigned_to: Joi.string().guid({ version: "uuidv4" }).optional()
});

const assignTaskSchema = Joi.object({
  user_id: Joi.string().guid({ version: "uuidv4" }).required(),
});

const updateTaskStatusSchema = Joi.object({
  status: Joi.string().valid("todo","in_progress", "done").required()
});

const addCommentSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required()
});

const listTasksSchema = Joi.object({
  project_id: Joi.string().guid({ version: "uuidv4" }).optional(),
  status: Joi.string().valid("todo", "in_progress", "done").optional(),
  assigned_to: Joi.string().guid({ version: "uuidv4" }).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = { createTaskSchema,assignTaskSchema, addCommentSchema, listTasksSchema, updateTaskStatusSchema };
