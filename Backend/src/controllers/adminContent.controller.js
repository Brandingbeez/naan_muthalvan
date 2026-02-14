const contentService = require('../services/content.service');
const { writeAudit } = require('../services/audit.service');
const { asyncHandler } = require('../utils/asyncHandler');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Session = require('../models/Session');
const Resource = require('../models/Resource');

const createCenter = asyncHandler(async (req, res) => {
  const center = await contentService.createCenter(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'create_center',
    entityType: 'center',
    entityId: center._id,
    req,
    requestBody: req.body,
    responseBody: center,
    statusCode: 201,
    success: true,
  });
  res.status(201).json(center);
});

const getCenters = asyncHandler(async (req, res) => {
  const centers = await contentService.getCenters();
  res.json(centers);
});

const updateCenter = asyncHandler(async (req, res) => {
  const center = await contentService.updateCenter(req.params.id, req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'update_center',
    entityType: 'center',
    entityId: req.params.id,
    req,
    requestBody: req.body,
    responseBody: center,
    statusCode: 200,
    success: true,
  });
  res.json(center);
});

const deleteCenter = asyncHandler(async (req, res) => {
  const center = await contentService.deleteCenter(req.params.id);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'delete_center',
    entityType: 'center',
    entityId: req.params.id,
    req,
    statusCode: 200,
    success: true,
  });
  res.json(center);
});

// Similarly for course, subject, session, resource

const createCourse = asyncHandler(async (req, res) => {
  const course = await contentService.createCourse(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'create_course',
    entityType: 'course',
    entityId: course._id,
    req,
    requestBody: req.body,
    responseBody: course,
    statusCode: 201,
    success: true,
  });
  res.status(201).json(course);
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true }); // For admin, all
  res.json(courses);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await contentService.updateCourse(req.params.id, req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'update_course',
    entityType: 'course',
    entityId: req.params.id,
    req,
    requestBody: req.body,
    responseBody: course,
    statusCode: 200,
    success: true,
  });
  res.json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await contentService.deleteCourse(req.params.id);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'delete_course',
    entityType: 'course',
    entityId: req.params.id,
    req,
    statusCode: 200,
    success: true,
  });
  res.json(course);
});

// Similarly for others

const createSubject = asyncHandler(async (req, res) => {
  const subject = await contentService.createSubject(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'create_subject',
    entityType: 'subject',
    entityId: subject._id,
    req,
    requestBody: req.body,
    responseBody: subject,
    statusCode: 201,
    success: true,
  });
  res.status(201).json(subject);
});

const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ isActive: true });
  res.json(subjects);
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await contentService.updateSubject(req.params.id, req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'update_subject',
    entityType: 'subject',
    entityId: req.params.id,
    req,
    requestBody: req.body,
    responseBody: subject,
    statusCode: 200,
    success: true,
  });
  res.json(subject);
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await contentService.deleteSubject(req.params.id);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'delete_subject',
    entityType: 'subject',
    entityId: req.params.id,
    req,
    statusCode: 200,
    success: true,
  });
  res.json(subject);
});

const createSession = asyncHandler(async (req, res) => {
  const session = await contentService.createSession(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'create_session',
    entityType: 'session',
    entityId: session._id,
    req,
    requestBody: req.body,
    responseBody: session,
    statusCode: 201,
    success: true,
  });
  res.status(201).json(session);
});

const getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ isActive: true });
  res.json(sessions);
});

const updateSession = asyncHandler(async (req, res) => {
  const session = await contentService.updateSession(req.params.id, req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'update_session',
    entityType: 'session',
    entityId: req.params.id,
    req,
    requestBody: req.body,
    responseBody: session,
    statusCode: 200,
    success: true,
  });
  res.json(session);
});

const deleteSession = asyncHandler(async (req, res) => {
  const session = await contentService.deleteSession(req.params.id);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'delete_session',
    entityType: 'session',
    entityId: req.params.id,
    req,
    statusCode: 200,
    success: true,
  });
  res.json(session);
});

const createResource = asyncHandler(async (req, res) => {
  const resource = await contentService.createResource(req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'create_resource',
    entityType: 'resource',
    entityId: resource._id,
    req,
    requestBody: req.body,
    responseBody: resource,
    statusCode: 201,
    success: true,
  });
  res.status(201).json(resource);
});

const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isActive: true });
  res.json(resources);
});

const updateResource = asyncHandler(async (req, res) => {
  const resource = await contentService.updateResource(req.params.id, req.body);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'update_resource',
    entityType: 'resource',
    entityId: req.params.id,
    req,
    requestBody: req.body,
    responseBody: resource,
    statusCode: 200,
    success: true,
  });
  res.json(resource);
});

const deleteResource = asyncHandler(async (req, res) => {
  // Get the resource first to get the GCS object path
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const deletedResource = await contentService.deleteResource(req.params.id, resource.gcsObjectPath);
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'delete_resource',
    entityType: 'resource',
    entityId: req.params.id,
    req,
    statusCode: 200,
    success: true,
  });
  res.json(deletedResource);
});

/**
 * Upload a file resource (PDF, PPT, DOC, XLS, Video)
 */
const uploadFileResource = asyncHandler(async (req, res) => {
  const { sessionId, title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Get session to extract course and subject info
  const session = await Session.findById(sessionId).populate('subjectId');
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (!session.subjectId || !session.subjectId.courseId) {
    return res.status(400).json({ error: 'Session missing course or subject info' });
  }

  const subject = await Subject.findById(session.subjectId._id).populate('courseId');
  const course = subject.courseId;

  // Create file resource with GCS upload
  const resource = await contentService.createFileResource({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    sessionId,
    title,
    description,
    courseCode: course.courseCode,
    subjectId: session.subjectId._id,
  });

  // Audit log
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'upload_resource_file',
    entityType: 'resource',
    entityId: resource._id,
    req,
    requestBody: {
      sessionId,
      title,
      description,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
    responseBody: resource,
    statusCode: 201,
    success: true,
  });

  res.status(201).json(resource);
});

/**
 * Upload a YouTube resource
 */
const uploadYoutubeResource = asyncHandler(async (req, res) => {
  const { sessionId, title, youtubeUrl, description } = req.body;

  const resource = await contentService.createYoutubeResource({
    sessionId,
    title,
    youtubeUrl,
    description,
  });

  // Audit log
  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'upload_resource_youtube',
    entityType: 'resource',
    entityId: resource._id,
    req,
    requestBody: {
      sessionId,
      title,
      youtubeUrl,
      description,
    },
    responseBody: resource,
    statusCode: 201,
    success: true,
  });

  res.status(201).json(resource);
});

module.exports = {
  createCenter,
  getCenters,
  updateCenter,
  deleteCenter,
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  createSession,
  getSessions,
  updateSession,
  deleteSession,
  createResource,
  getResources,
  updateResource,
  deleteResource,
  uploadFileResource,
  uploadYoutubeResource,
};