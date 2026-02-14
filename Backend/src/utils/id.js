const { v4: uuidv4 } = require('uuid');

const generateRequestId = () => uuidv4();

const generateSubscriptionId = () => uuidv4();

const generateAccessToken = () => uuidv4();

module.exports = { generateRequestId, generateSubscriptionId, generateAccessToken };