const { z } = require('zod');

const { objectIdSchema } = require('./common.schemas');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).strict();

const centerCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
}).strict();

const courseCreateSchema = z.object({
  centerId: objectIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  courseCode: z.string().min(1),
  imageUrl: z.string().url().optional(),
  courseType: z.enum(['online', 'offline']).default('online'),
  objectives: z.array(z.object({ objective: z.string().min(1) })).optional(),
}).strict();

const subjectCreateSchema = z.object({
  courseId: objectIdSchema,
  title: z.string().min(1),
  content: z.string().optional(),
}).strict();

const sessionCreateSchema = z.object({
  subjectId: objectIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  sessionNumber: z.number().int().positive(),
}).strict();

const resourceCreateSchema = z.object({
  sessionId: objectIdSchema,
  title: z.string().min(1),
  type: z.enum(['youtube', 'file']),
  url: z.string().url(),
}).strict();

const auditQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  actorType: z.string().optional(),
  action: z.string().optional(),
}).strict();

module.exports = {
  loginSchema,
  centerCreateSchema,
  courseCreateSchema,
  subjectCreateSchema,
  sessionCreateSchema,
  resourceCreateSchema,
  auditQuerySchema,
};