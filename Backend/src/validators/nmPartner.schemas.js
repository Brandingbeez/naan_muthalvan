const { z } = require('zod');

const subscribeSchema = z.object({
  nmUserId: z.string().min(1),
  courseCode: z.string().min(1),
  studentMeta: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
  }).optional(),
}).strict();

const accessSchema = z.object({
  nmUserId: z.string().min(1),
  courseCode: z.string().min(1),
  studentMeta: z.object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
  }).optional(),
}).strict();

const progressSchema = z.object({
  nmUserId: z.string().min(1),
  courseCode: z.string().min(1),
  progress: z.record(z.any()),
}).strict();

module.exports = {
  subscribeSchema,
  accessSchema,
  progressSchema,
};