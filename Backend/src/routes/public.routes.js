const express = require('express');
const publicController = require('../controllers/public.controller');
const { validate } = require('../middleware/validate');
const { centerQuerySchema, courseQuerySchema, subjectQuerySchema, sessionQuerySchema, resourceQuerySchema } = require('../validators/content.schemas');
const { z } = require('zod');
const { objectIdSchema } = require('../validators/common.schemas');

const router = express.Router();

router.get('/centers', validate({ querySchema: centerQuerySchema }), publicController.getCenters);
router.get('/centers/:centerId/courses', validate({ paramsSchema: z.object({ centerId: objectIdSchema }), querySchema: courseQuerySchema }), publicController.getCourses);
router.get('/courses/:courseCode', validate({ paramsSchema: z.object({ courseCode: z.string().min(1) }) }), publicController.getCourse);
router.get('/courses/:courseCode/subjects', validate({ paramsSchema: z.object({ courseCode: z.string().min(1) }), querySchema: subjectQuerySchema }), publicController.getSubjects);
router.get('/subjects/:subjectId/sessions', validate({ paramsSchema: z.object({ subjectId: objectIdSchema }), querySchema: sessionQuerySchema }), publicController.getSessions);
router.get('/sessions/:sessionId/resources', validate({ paramsSchema: z.object({ sessionId: objectIdSchema }), querySchema: resourceQuerySchema }), publicController.getResources);

module.exports = router;