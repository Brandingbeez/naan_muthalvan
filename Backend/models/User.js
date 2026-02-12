const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        user_unique_id: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
