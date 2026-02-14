const NmProgress = require('../models/NmProgress');
const { getValidAccessToken } = require('./nmClient.service');
const axios = require('axios');
const { NM_BASE_URL } = require('../config/env');

const updateLocalProgress = async ({ nmUserId, courseCode, patch }) => {
  const progress = { ...patch };
  // Remove empty fields
  Object.keys(progress).forEach(key => {
    if (progress[key] === undefined || progress[key] === null || progress[key] === '') {
      delete progress[key];
    }
  });
  await NmProgress.findOneAndUpdate(
    { nmUserId, courseCode },
    { progress, lastUpdatedAt: new Date() },
    { upsert: true, new: true }
  );
};

const pushProgressToNmIfConfigured = async ({ nmUserId, courseCode, patch }) => {
  // Assume always push
  const token = await getValidAccessToken();
  await axios.post(`${NM_BASE_URL}/progress`, {
    nmUserId,
    courseCode,
    progress: patch,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

module.exports = { updateLocalProgress, pushProgressToNmIfConfigured };