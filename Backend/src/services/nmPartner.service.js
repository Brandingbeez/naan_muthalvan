const NmStudent = require('../models/NmStudent');
const NmSubscription = require('../models/NmSubscription');
const NmProgress = require('../models/NmProgress');
const { generateAccessToken } = require('../utils/id');

const subscribeFromNm = async (payload, reqMeta) => {
  const { nmUserId, courseCode, studentMeta } = payload;
  // Upsert student
  if (studentMeta) {
    await NmStudent.findOneAndUpdate(
      { nmUserId },
      { ...studentMeta, nmUserId },
      { upsert: true, new: true }
    );
  }
  // Create subscription if not exists
  await NmSubscription.findOneAndUpdate(
    { nmUserId, courseCode },
    { nmUserId, courseCode },
    { upsert: true, new: true }
  );
  return { success: true, message: 'Subscribed successfully' };
};

const accessFromNm = async (payload, reqMeta) => {
  const { nmUserId, courseCode, studentMeta } = payload;
  // Upsert student
  if (studentMeta) {
    await NmStudent.findOneAndUpdate(
      { nmUserId },
      { ...studentMeta, nmUserId },
      { upsert: true, new: true }
    );
  }
  // Ensure subscription
  await NmSubscription.findOneAndUpdate(
    { nmUserId, courseCode },
    { nmUserId, courseCode },
    { upsert: true, new: true }
  );
  // Generate access token
  const token = generateAccessToken();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  const NmAccessToken = require('../models/NmAccessToken');
  await NmAccessToken.create({
    token,
    nmUserId,
    courseCode,
    expiresAt,
  });
  return { access_url: `${reqMeta.baseUrl}/nm/launch?token=${token}` };
};

const getProgressForNm = async (payload) => {
  const { nmUserId, courseCode } = payload;
  const progress = await NmProgress.findOne({ nmUserId, courseCode });
  return progress ? progress.progress : {};
};

module.exports = {
  subscribeFromNm,
  accessFromNm,
  getProgressForNm,
};