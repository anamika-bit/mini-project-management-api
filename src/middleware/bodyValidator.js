const bodyValidator = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  
      if (error) {
        // Collect all error messages in one array
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ error: errors });
      }
  
      // Replace body with validated value
      req.body = value;
      next();
    };
  };
  
  module.exports = bodyValidator;
  