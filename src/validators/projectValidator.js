const Joi = require("joi");

const addProjectSchema = Joi.object({
    name : Joi.string().min(1).max(50).required(),
    description : Joi.string().min(10).max(255).allow("").optional(),
  });

module.exports = { addProjectSchema }  