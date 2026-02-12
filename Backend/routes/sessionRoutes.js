const express = require("express");
const { body } = require("express-validator");
const { authRequired, adminOnly } = require("../middleware/auth");
const {
  createSession,
  listBySection,
  getSessionById,
  addContentToSession,
  deleteSession,
  deleteSessionContent
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/by-section/:sectionId", authRequired, listBySection);
router.get("/:id", authRequired, getSessionById);

router.post(
  "/",
  authRequired,
  adminOnly,
  [
    body("sectionId").notEmpty().withMessage("sectionId is required"),
    body("title").trim().notEmpty().withMessage("title is required"),
    body("studyMaterialUrl").optional().isString(),
    body("pptUrl").optional().isString(),
    body("videoUrl").optional().isString(),
    body("duration").optional().isString(),
  ],
  createSession
);

// Add content items to existing session (for bulk uploads)
router.put("/:id/add-content", authRequired, adminOnly, addContentToSession);

router.delete("/:id", authRequired, adminOnly, deleteSession);
router.delete("/:id/content/:type/:contentId", authRequired, adminOnly, deleteSessionContent);

module.exports = router;

