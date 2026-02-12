const express = require("express");
const {
    getToken,
    refreshToken,
    publishCourse,
    listCourses,
    updateProgress,
    checkStudent
} = require("../controllers/lmsController");

const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify LMS Client Token
const verifyClientToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    detail: "Given token not valid for any token type",
                    code: "token_not_valid",
                    messages: [{ message: "Token is invalid or expired" }]
                });
            }
            return res.status(403).json({ message: "Invalid token" });
        }

        // Check if it's a client token
        // The decoded token from getToken middleware has { type: 'client' } (see lmsController)
        // But if we want to be strict:
        // const { type } = decoded;
        // if (type !== 'client') return res.status(403).send(...);

        req.client = decoded;
        next();
    });
};


// 1. Authentication
router.post("/client/token/", getToken);
router.post("/client/token/refresh/", refreshToken);

// 2. Course
router.post("/client/course/publish/", verifyClientToken, publishCourse);
router.get("/client/courses/", verifyClientToken, listCourses);

// 3. Student
router.post("/client/course/xf/", verifyClientToken, updateProgress);
router.get("/client/course/student/check/", verifyClientToken, checkStudent);

module.exports = router;
