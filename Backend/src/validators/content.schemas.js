const { z } = require('zod');

const { objectIdSchema } = require('./common.schemas');

const centerQuerySchema = z.object({}).strict();

const courseQuerySchema = z.object({}).strict();

const subjectQuerySchema = z.object({}).strict();

const sessionQuerySchema = z.object({}).strict();

const resourceQuerySchema = z.object({}).strict();

// Resource creation schemas
const resourceFileUploadSchema = z.object({
  sessionId: objectIdSchema,
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
}).strict();

const resourceYoutubeSchema = z.object({
  sessionId: objectIdSchema,
  title: z.string().min(1, 'Title is required').max(255),
  youtubeUrl: z.string().url('Invalid YouTube URL'),
  description: z.string().max(1000).optional(),
}).strict()
  .refine(
    (data) => {
      // Check if URL is YouTube
      return data.youtubeUrl.includes('youtube.com') || data.youtubeUrl.includes('youtu.be');
    },
    { message: 'URL must be a valid YouTube URL', path: ['youtubeUrl'] }
  );

module.exports = {
  centerQuerySchema,
  courseQuerySchema,
  subjectQuerySchema,
  sessionQuerySchema,
  resourceQuerySchema,
  resourceFileUploadSchema,
  resourceYoutubeSchema,
};