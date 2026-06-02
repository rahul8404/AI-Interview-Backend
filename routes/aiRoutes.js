const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();
const authMiddleware = require("../middlewares/userMiddleware.js")

// import controller

const {
    analyzeResume, getHistory, deleteHistory,
} = require("../controllers/aiController.js");



const {
    generateQuestions,
    evaluateInterview,
    getInterviewHistory,
    deleteInterviewHistory
} = require("../controllers/interviewController.js");


// route

router.post(

    "/analyze-resume",

    authMiddleware,

    upload.single("resume"),

    analyzeResume

);

router.get(
    "/history",
    authMiddleware,
    getHistory
);

router.delete(
    "/history/:id",
    authMiddleware,
    deleteHistory
);

router.post(
    "/questions",
    generateQuestions
);

router.post(
    "/evaluate",
    authMiddleware,
    evaluateInterview
);

router.get(
    "/interview-history",
    authMiddleware,
    getInterviewHistory
);

router.delete(
    "/interview-history/:id",
    authMiddleware,
    deleteInterviewHistory
);
module.exports = router;