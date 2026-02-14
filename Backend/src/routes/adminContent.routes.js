const express = require('express');
const adminContentController = require('../controllers/adminContent.controller');
const { validate } = require('../middleware/validate');
const { centerCreateSchema, courseCreateSchema, subjectCreateSchema, sessionCreateSchema, resourceCreateSchema } = require('../validators/admin.schemas');
const { resourceFileUploadSchema, resourceYoutubeSchema } = require('../validators/content.schemas');
const { objectIdSchema } = require('../validators/common.schemas');
const { uploadSingle, fileGuard } = require('../middleware/upload');
const { z } = require('zod');

const router = express.Router();

// Centers
router.post('/centers', validate({ bodySchema: centerCreateSchema }), adminContentController.createCenter);
router.get('/centers', adminContentController.getCenters);
router.put('/centers/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.updateCenter);
router.delete('/centers/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.deleteCenter);

// Courses
router.post('/courses', validate({ bodySchema: courseCreateSchema }), adminContentController.createCourse);
router.get('/courses', adminContentController.getCourses);
router.put('/courses/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.updateCourse);
router.delete('/courses/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.deleteCourse);

// Subjects
router.post('/subjects', validate({ bodySchema: subjectCreateSchema }), adminContentController.createSubject);
router.get('/subjects', adminContentController.getSubjects);
router.put('/subjects/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.updateSubject);
router.delete('/subjects/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.deleteSubject);

// Sessions
router.post('/sessions', validate({ bodySchema: sessionCreateSchema }), adminContentController.createSession);
router.get('/sessions', adminContentController.getSessions);
router.put('/sessions/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.updateSession);
router.delete('/sessions/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.deleteSession);

// Resources
router.post('/resources', validate({ bodySchema: resourceCreateSchema }), adminContentController.createResource);
router.post('/resources/file', uploadSingle('file'), fileGuard, validate({ bodySchema: resourceFileUploadSchema }), adminContentController.uploadFileResource);
router.post('/resources/youtube', validate({ bodySchema: resourceYoutubeSchema }), adminContentController.uploadYoutubeResource);
router.get('/resources', adminContentController.getResources);
router.put('/resources/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.updateResource);
router.delete('/resources/:id', validate({ paramsSchema: z.object({ id: objectIdSchema }) }), adminContentController.deleteResource);

module.exports = router;