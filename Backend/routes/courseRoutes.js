const express = require("express");
const { body } = require("express-validator");
const { authRequired, adminOnly } = require("../middleware/auth");
const {
  createCourse,
  listCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", authRequired, listCourses);
router.get("/:id", authRequired, getCourseById);

router.post(
  "/",
  authRequired,
  adminOnly,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("thumbnail").optional().isString(),
  ],
  createCourse
);

router.delete("/:id", authRequired, adminOnly, deleteCourse);

module.exports = router;

