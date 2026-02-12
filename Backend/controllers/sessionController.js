const { validationResult } = require("express-validator");
const Session = require("../models/Session");
const Section = require("../models/Section");

exports.createSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });

    const {
      sectionId,
      title,
      description,
      // New: arrays of content items
      videos = [],
      ppts = [],
      materials = [],
      // Legacy: single URLs (for backward compatibility)
      studyMaterialUrl,
      pptUrl,
      videoUrl,
      duration,
    } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    // Build session data
    const sessionData = {
      sectionId,
      title,
      description: description || "",
      videos: Array.isArray(videos) ? videos : [],
      ppts: Array.isArray(ppts) ? ppts : [],
      materials: Array.isArray(materials) ? materials : [],
    };

    // Legacy support: if single URLs provided, convert to arrays
    if (videoUrl && !sessionData.videos.length) {
      sessionData.videos = [{
        title: title || "Video",
        videoUrl,
        publicId: "",
        duration: duration || "",
        order: 0,
      }];
    }
    if (pptUrl && !sessionData.ppts.length) {
      sessionData.ppts = [{
        title: title || "PPT",
        pptUrl,
        publicId: "",
        order: 0,
      }];
    }
    if (studyMaterialUrl && !sessionData.materials.length) {
      sessionData.materials = [{
        title: title || "Study Material",
        materialUrl: studyMaterialUrl,
        publicId: "",
        order: 0,
      }];
    }

    const session = await Session.create(sessionData);

    // Log what was saved for debugging
    console.log("[Session Controller] Session created:", {
      id: session._id,
      title: session.title,
      videosCount: session.videos?.length || 0,
      pptsCount: session.ppts?.length || 0,
      materialsCount: session.materials?.length || 0,
      firstVideoUrl: session.videos?.[0]?.videoUrl || "none",
      firstMaterialUrl: session.materials?.[0]?.materialUrl || "none",
    });

    return res.status(201).json(session);
  } catch (err) {
    return next(err);
  }
};

exports.listBySection = async (req, res, next) => {
  try {
    const sessions = await Session.find({ sectionId: req.params.sectionId }).sort({ createdAt: 1 });
    return res.json(sessions);
  } catch (err) {
    return next(err);
  }
};

exports.getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate({
      path: "sectionId",
      populate: {
        path: "courseId",
        model: "Course",
      },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    return res.json(session);
  } catch (err) {
    return next(err);
  }
};

/**
 * Add content items to an existing session
 * PUT /api/sessions/:id/add-content
 * Body: { videos?: [...], ppts?: [...], materials?: [...] }
 */
exports.addContentToSession = async (req, res, next) => {
  try {
    const { videos = [], ppts = [], materials = [] } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Append new items to existing arrays
    if (Array.isArray(videos) && videos.length > 0) {
      session.videos = [...(session.videos || []), ...videos];
    }
    if (Array.isArray(ppts) && ppts.length > 0) {
      session.ppts = [...(session.ppts || []), ...ppts];
    }
    if (Array.isArray(materials) && materials.length > 0) {
      session.materials = [...(session.materials || []), ...materials];
    }

    await session.save();
    return res.json(session);
  } catch (err) {
    return next(err);
  }
};
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    await session.deleteOne();
    return res.json({ message: "Session deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

exports.deleteSessionContent = async (req, res, next) => {
  try {
    // type: videos, ppts, materials
    const { id, type, contentId } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!["videos", "ppts", "materials"].includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    // Filter out the item by _id if exists, otherwise by comparing properties or just matching
    // session[type] is an array of subdocuments.
    // If contentId is a valid ObjectId, we use it. If it looks like publicId or just an index...
    // Given the difficulty of ID matching without explicit IDs in schema, 
    // we'll assume contentId is the index if it's numeric, or publicId if string.

    const array = session[type];
    let newArray = [];

    // Try to treat contentId as index first if numeric
    if (!isNaN(contentId) && parseInt(contentId) >= 0 && parseInt(contentId) < array.length) {
      // It's an index
      const idx = parseInt(contentId);
      newArray = array.filter((_, i) => i !== idx);
    } else {
      // Try to match by publicId or _id
      newArray = array.filter(item =>
        (item._id && item._id.toString() !== contentId) &&
        (item.publicId !== contentId)
      );
    }

    if (newArray.length === array.length) {
      // Nothing deleted
      return res.status(404).json({ message: "Content item not found" });
    }

    session[type] = newArray;
    await session.save();
    return res.json(session);

  } catch (err) {
    return next(err);
  }
};
