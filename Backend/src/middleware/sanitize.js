const sanitize = (req, res, next) => {
  // Remove prototype pollution keys
  const removeProto = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) {
      return obj.map(removeProto);
    }
    const sanitized = {};
    for (const key in obj) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      sanitized[key] = removeProto(obj[key]);
    }
    return sanitized;
  };
  req.body = removeProto(req.body);
  req.query = removeProto(req.query);
  req.params = removeProto(req.params);
  // Trim strings
  const trimStrings = (obj) => {
    if (typeof obj === 'string') return obj.trim();
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) {
      return obj.map(trimStrings);
    }
    const trimmed = {};
    for (const key in obj) {
      trimmed[key] = trimStrings(obj[key]);
    }
    return trimmed;
  };
  req.body = trimStrings(req.body);
  req.query = trimStrings(req.query);
  req.params = trimStrings(req.params);
  next();
};

module.exports = { sanitize };