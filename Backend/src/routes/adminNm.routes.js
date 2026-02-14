const express = require('express');
const { publishCourse, getCourses } = require('../controllers/adminNm.controller');

const router = express.Router();

router.post('/nm/publish/:courseCode', publishCourse);
router.get('/nm/courses', getCourses);

module.exports = router;