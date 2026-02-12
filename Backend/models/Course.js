const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null,
            index: true,
        },
        order: { type: Number, default: 0 },

        // LMS Specific Fields
        course_unique_code: { type: String, unique: true, sparse: true },
        instructor: { type: String },
        duration: { type: String }, // Storing as string to match "1050" example
        number_of_videos: { type: String }, // Storing as string to match "45" example
        language: { type: String, default: "english" },
        main_stream: { type: String },
        sub_stream: { type: String },
        category: { type: String },
        system_requirements: { type: String },
        has_subtitles: { type: Boolean, default: false },
        reference_id: { type: String },
        course_type: { type: String, default: "ONLINE" },
        location: { type: String },
        approval_status: { type: Boolean, default: false },
        is_active: { type: Boolean, default: true },
        course_outcomes: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
