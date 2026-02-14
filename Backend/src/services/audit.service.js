const AuditLog = require('../models/AuditLog');

const writeAudit = async ({ actorType, actorId, action, entityType, entityId, req, requestBody, responseBody, statusCode, success, errorMessage }) => {
  try {
    const trimmedRequest = requestBody ? JSON.stringify(requestBody).substring(0, 5000) : null;
    const trimmedResponse = responseBody ? JSON.stringify(responseBody).substring(0, 5000) : null;
    await AuditLog.create({
      actorType,
      actorId,
      action,
      entityType,
      entityId,
      requestId: req?.id,
      requestBody: trimmedRequest,
      responseBody: trimmedResponse,
      statusCode,
      success,
      errorMessage,
    });
  } catch (err) {
    // Swallow errors
    console.error('Audit write failed:', err);
  }
};

module.exports = { writeAudit };