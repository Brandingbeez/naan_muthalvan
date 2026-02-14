const Center = require('../models/Center');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Session = require('../models/Session');
const Resource = require('../models/Resource');
const storageService = require('./storage.service');
const { GCS_SIGNED_URL_TTL_SECONDS } = require('../config/env');

const createCenter = async (data) => {
  const center = new Center(data);
  return await center.save();
};

const getCenters = async () => {
  return await Center.find({ isActive: true });
};

const updateCenter = async (id, data) => {
  return await Center.findByIdAndUpdate(id, data, { new: true });
};

const deleteCenter = async (id) => {
  return await Center.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const createCourse = async (data) => {
  data.courseCodeLower = data.courseCode.toLowerCase();
  const course = new Course(data);
  await course.save();
  return course;
};

const getCourses = async (centerId) => {
  return await Course.find({ centerId, isActive: true });
};

const getCourse = async (courseCode) => {
  return await Course.findOne({ courseCode, isActive: true });
};

const updateCourse = async (id, data) => {
  if (data.courseCode) {
    data.courseCodeLower = data.courseCode.toLowerCase();
  }
  return await Course.findByIdAndUpdate(id, data, { new: true });
};

const deleteCourse = async (id) => {
  return await Course.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const createSubject = async (data) => {
  const subject = new Subject(data);
  await subject.save();
  return subject;
};

const getSubjects = async (courseCode) => {
  const course = await Course.findOne({ courseCode, isActive: true });
  if (!course) return [];
  return await Subject.find({ courseId: course._id, isActive: true });
};

const updateSubject = async (id, data) => {
  return await Subject.findByIdAndUpdate(id, data, { new: true });
};

const deleteSubject = async (id) => {
  return await Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const createSession = async (data) => {
  const session = new Session(data);
  await session.save();
  return session;
};

const getSessions = async (subjectId) => {
  return await Session.find({ subjectId, isActive: true });
};

const updateSession = async (id, data) => {
  return await Session.findByIdAndUpdate(id, data, { new: true });
};

const deleteSession = async (id) => {
  return await Session.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const createResource = async (data) => {
  const resource = new Resource(data);
  return await resource.save();
};

/**
 * Create a file resource with GCS upload
 */
const createFileResource = async ({
  buffer,
  originalName,
  mimeType,
  sizeBytes,
  sessionId,
  title,
  description,
  courseCode,
  subjectId,
}) => {
  // Upload to GCS
  const gcsMetadata = await storageService.uploadFile({
    buffer,
    originalName,
    mimeType,
    courseCode,
    subjectId,
    sessionId,
  });

  // Create resource document
  const resourceData = {
    sessionId,
    title,
    description,
    type: 'file',
    storageProvider: 'gcs',
    ...gcsMetadata,
    isActive: true,
  };

  const resource = new Resource(resourceData);
  return await resource.save();
};

/**
 * Create a YouTube resource
 */
const createYoutubeResource = async ({
  sessionId,
  title,
  youtubeUrl,
  description,
}) => {
  const resourceData = {
    sessionId,
    title,
    description,
    type: 'youtube',
    youtubeUrl,
    isActive: true,
  };

  const resource = new Resource(resourceData);
  return await resource.save();
};

/**
 * Get resources with signed URLs for file resources
 */
const getResourcesWithSignedUrls = async (sessionId, { withSignedUrls = true } = {}) => {
  const resources = await Resource.find({ sessionId, isActive: true });

  if (!withSignedUrls) {
    return resources;
  }

  // Generate signed URLs for file resources
  const resourcesWithUrls = await Promise.all(
    resources.map(async (resource) => {
      const resourceObj = resource.toObject();

      if (resource.type === 'file' && resource.gcsObjectPath) {
        try {
          resourceObj.previewUrl = await storageService.getSignedPreviewUrl(
            resource.gcsObjectPath,
            GCS_SIGNED_URL_TTL_SECONDS
          );
          resourceObj.downloadUrl = await storageService.getSignedDownloadUrl(
            resource.gcsObjectPath,
            resource.originalFileName,
            GCS_SIGNED_URL_TTL_SECONDS
          );
        } catch (err) {
          console.error(`Failed to generate signed URL for resource ${resource._id}:`, err);
          // Continue without signed URLs for this resource
        }
      }

      return resourceObj;
    })
  );

  return resourcesWithUrls;
};

const getResources = async (sessionId) => {
  return await Resource.find({ sessionId, isActive: true });
};

const updateResource = async (id, data) => {
  return await Resource.findByIdAndUpdate(id, data, { new: true });
};

const deleteResource = async (id, gcsObjectPath) => {
  // Delete from GCS if it's a file resource
  if (gcsObjectPath) {
    try {
      await storageService.deleteFile(gcsObjectPath);
    } catch (err) {
      console.error('Failed to delete file from GCS:', err);
      // Continue with database deletion even if GCS delete fails
    }
  }

  return await Resource.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

module.exports = {
  createCenter,
  getCenters,
  updateCenter,
  deleteCenter,
  createCourse,
  getCourses,
  getCourse,
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
  createFileResource,
  createYoutubeResource,
  getResources,
  getResourcesWithSignedUrls,
  updateResource,
  deleteResource,
};