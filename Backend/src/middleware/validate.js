const validate = ({ bodySchema, querySchema, paramsSchema }) => {
  return (req, res, next) => {
    const errors = [];
    if (bodySchema) {
      const result = bodySchema.safeParse(req.body);
      if (!result.success) {
        errors.push(...result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })));
      }
    }
    if (querySchema) {
      const result = querySchema.safeParse(req.query);
      if (!result.success) {
        errors.push(...result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })));
      }
    }
    if (paramsSchema) {
      const result = paramsSchema.safeParse(req.params);
      if (!result.success) {
        errors.push(...result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })));
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        errors,
        requestId: req.id,
      });
    }
    next();
  };
};

module.exports = { validate };