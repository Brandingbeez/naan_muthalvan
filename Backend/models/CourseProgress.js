const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        progress_percentage: { type: Number, default: 0 },
        certificate_issued: { type: Boolean, default: false },
        certificate_issued_at: { type: Date },
        assessment_status: { type: Boolean, default: false },
        course_complete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure a user has only one progress record per course
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
