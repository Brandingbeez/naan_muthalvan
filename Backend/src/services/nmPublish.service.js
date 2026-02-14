const Course = require('../models/Course');
const Subject = require('../models/Subject');
const { getValidAccessToken } = require('./nmClient.service');
const axios = require('axios');
const { NM_BASE_URL } = require('../config/env');

const buildPublishPayload = async (courseCode) => {
  const course = await Course.findOne({ courseCode, isActive: true });
  if (!course) throw new Error('Course not found');
  const subjects = await Subject.find({ courseId: course._id, isActive: true });
  return {
    courseCode: course.courseCode,
    title: course.title,
    description: course.description,
    objectives: course.objectives,
    subjects: subjects.map(s => ({ title: s.title, content: s.content })),
  };
};

const publishCourseToNm = async (courseCode) => {
  const payload = await buildPublishPayload(courseCode);
  const token = await getValidAccessToken();
  const response = await axios.post(`${NM_BASE_URL}/courses`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

module.exports = { publishCourseToNm };