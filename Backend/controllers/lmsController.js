const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const LmsClient = require("../models/LmsClient");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");

// Helper to sign JWT for LMS Client
function signClientToken(client) {
    // Payload distinguishes client from regular user if needed, or we just rely on separate route guards
    return jwt.sign(
        { id: client._id.toString(), type: "client", name: client.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Short lived access token
    );
}

function signRefreshToken(client) {
    return jwt.sign(
        { id: client._id.toString(), type: "client_refresh" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// 1.1 Token Retrieval
exports.getToken = async (req, res) => {
    try {
        const { client_key, client_secret } = req.body;
        if (!client_key || !client_secret) {
            return res.status(400).json({ message: "client_key and client_secret are required" });
        }

        const client = await LmsClient.findOne({ client_key });
        if (!client || !client.isActive) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(client_secret, client.client_secret);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const access_key = signClientToken(client);
        const refresh_key = signRefreshToken(client);

        res.json({ access_key, refresh_key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 1.2 Token Refresh
exports.refreshToken = async (req, res) => {
    try {
        const { refresh } = req.body;
        if (!refresh) return res.status(400).json({ message: "Refresh token required" });

        jwt.verify(refresh, process.env.JWT_SECRET, async (err, decoded) => {
            if (err || decoded.type !== "client_refresh") {
                return res.status(401).json({ message: "Invalid or expired refresh token" });
            }

            const client = await LmsClient.findById(decoded.id);
            if (!client || !client.isActive) {
                return res.status(401).json({ message: "Client not found or inactive" });
            }

            const access_key = signClientToken(client);
            // Optionally rotate refresh token here
            res.json({ access_key, refresh: refresh });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 2.1 Publish a Course
exports.publishCourse = async (req, res) => {
    try {
        const {
            course_unique_code,
            course_name,
            course_description,
            course_image_url,
            instructor,
            duration,
            number_of_videos,
            language,
            main_stream,
            sub_stream,
            category,
            system_requirements,
            has_subtitles,
            reference_id,
            course_type,
            location,
            course_outcomes
        } = req.body;

        // Basic validation
        if (!course_unique_code || !course_name) {
            return res.status(400).json({ message: "course_unique_code and course_name are required" });
        }

        // Check if course exists
        let course = await Course.findOne({ course_unique_code });
        const courseData = {
            title: course_name, // Mapping course_name to title
            description: course_description || "",
            thumbnail: course_image_url || "",
            instructor,
            duration,
            number_of_videos,
            language,
            main_stream,
            sub_stream,
            category,
            system_requirements,
            has_subtitles: has_subtitles === "true" || has_subtitles === true,
            reference_id,
            course_type,
            location,
            course_outcomes,
            approval_status: false, // Always requires approval
            // If updating, keep existing ID, else new
        };

        if (course) {
            // Update existing
            Object.assign(course, courseData);
            await course.save();
        } else {
            // Create new
            course = await Course.create({ ...courseData, course_unique_code });
        }

        // Email notification logic would go here

        res.json({
            message: "Course has been sent for approval , you will get email as confirmation"
        });
    } catch (err) {
        console.error("Publish Course Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 2.2 Courses List
exports.listCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 20; // Default from example response
        const { course_unique_code, is_active, approval_status } = req.query;

        const query = {};
        if (course_unique_code) query.course_unique_code = course_unique_code;
        if (is_active !== undefined) query.is_active = is_active === "true";
        if (approval_status !== undefined) query.approval_status = approval_status === "true";

        // Ensure we only list LMS courses (those with course_unique_code)?? 
        // Or all courses? The req implies fetching by LMS params. 
        // We'll filter only if query requires, but standard list usually returns all.

        const courses = await Course.find(query)
            .skip(page * limit)
            .limit(limit)
            .select("title course_unique_code is_active approval_status");

        const total_count = await Course.countDocuments(query);

        const formattedList = courses.map(c => ({
            name: c.title,
            course_id: c.course_unique_code || c._id.toString(), // Fallback to ID if no code
            course_status: c.approval_status // Assuming 'course_status' map to approval_status or is_active? Example shows boolean.
            // Example: { "course_status": false }. 
            // Let's assume it maps to approval_status (false=pending).
        }));

        res.json({
            courses_list: formattedList,
            page,
            limit,
            total_count
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 3.1 Progress Update
exports.updateProgress = async (req, res) => {
    try {
        const {
            user_unique_id,
            course_unique_code,
            progress_percentage,
            certificate_issued,
            certificate_issued_at,
            assessment_status,
            course_complete
        } = req.body;

        if (!user_unique_id || !course_unique_code) {
            return res.status(400).json({ message: "Please provide valid user_unique_id/ course_unique_code" });
        }

        const user = await User.findOne({ user_unique_id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const course = await Course.findOne({ course_unique_code });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Find or Create Progress
        let progress = await CourseProgress.findOne({ userId: user._id, courseId: course._id });

        if (!progress) {
            progress = new CourseProgress({ userId: user._id, courseId: course._id });

            // Also ensure user is "enrolled" in User model if not already
            if (!user.enrolledCourses) {
                user.enrolledCourses = [];
            }

            if (!user.enrolledCourses.includes(course._id)) {
                user.enrolledCourses.push(course._id);
                await user.save();
            }
        }

        if (progress_percentage !== undefined) progress.progress_percentage = parseFloat(progress_percentage);
        if (certificate_issued !== undefined) progress.certificate_issued = certificate_issued;
        if (certificate_issued_at !== undefined) progress.certificate_issued_at = new Date(certificate_issued_at);
        if (assessment_status !== undefined) progress.assessment_status = assessment_status;
        if (course_complete !== undefined) progress.course_complete = course_complete;

        await progress.save();

        res.json({ message: "Progress updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 3.2 Student Check
exports.checkStudent = async (req, res) => {
    try {
        // The request body shows user_unique_id and course_unique_code inside a GET? 
        // GET requests shouldn't have bodies usually, but curl example has string body.
        // Wait, the documentation says "GET" but has "Request Body (raw / JSON)".
        // Standard GETs don't use bodies. I will check req.body but also query params.
        // Express doesn't parse body on GET by default sometimes or clients don't send it. 
        // But strictly following the doc:
        // If it's GET with body, I'll try to read body. `express.json()` handles it if content-type is json.

        // However, usually "GET" with params means query params. 
        // The example provided implies sending JSON body. 
        // I will support req.body (if client sends it) OR req.query.

        const user_unique_id = req.body.user_unique_id || req.query.user_unique_id;
        const course_unique_code = req.body.course_unique_code || req.query.course_unique_id; // Typo check in query?

        if (!user_unique_id) {
            return res.status(400).json({ message: "user_unique_id required" });
        }

        const user = await User.findOne({ user_unique_id });
        if (!user) {
            // 404? 
            // The requirement doesn't specify success response format, only "Example Error Response".
            // I'll assume 200 OK + some user details if found, or boolean.
            return res.status(404).json({ message: "User not found" });
        }

        // If course code provided, check enrollment?
        if (course_unique_code) {
            const course = await Course.findOne({ course_unique_code });
            if (course) {
                const isEnrolled = user.enrolledCourses.includes(course._id);
                return res.json({
                    status: "success",
                    user_exists: true,
                    enrolled: isEnrolled
                });
            }
        }

        res.json({ status: "success", user_exists: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
