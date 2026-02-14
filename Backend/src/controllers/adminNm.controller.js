const { publishCourseToNm } = require('../services/nmPublish.service');
const Course = require('../models/Course');
const { writeAudit } = require('../services/audit.service');
const { asyncHandler } = require('../utils/asyncHandler');

const publishCourse = asyncHandler(async (req, res) => {
  const { courseCode } = req.params;
  const result = await publishCourseToNm(courseCode);

  // Update course to mark as published to NM
  await Course.findOneAndUpdate(
    { courseCode },
    { nmPublished: true },
    { new: true }
  );

  await writeAudit({
    actorType: 'admin',
    actorId: req.admin.id,
    action: 'publish_course',
    entityType: 'course',
    entityId: courseCode,
    req,
    responseBody: result,
    statusCode: 200,
    success: true,
  });
  res.json(result);
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true });
  res.json(courses);
});

module.exports = { publishCourse, getCourses };