const contentService = require('../services/content.service');
const { asyncHandler } = require('../utils/asyncHandler');

const getCenters = asyncHandler(async (req, res) => {
  const centers = await contentService.getCenters();
  res.json(centers);
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await contentService.getCourses(req.params.centerId);
  res.json(courses);
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await contentService.getCourse(req.params.courseCode);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
});

const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await contentService.getSubjects(req.params.courseCode);
  res.json(subjects);
});

const getSessions = asyncHandler(async (req, res) => {
  const sessions = await contentService.getSessions(req.params.subjectId);
  res.json(sessions);
});

const getResources = asyncHandler(async (req, res) => {
  const resources = await contentService.getResourcesWithSignedUrls(req.params.sessionId, { withSignedUrls: true });
  res.json(resources);
});

module.exports = {
  getCenters,
  getCourses,
  getCourse,
  getSubjects,
  getSessions,
  getResources,
};