const express = require('express');

const router = express.Router();

const authMiddleware = require("../middlewares/userMiddleware.js");

const {
    signup,
    login,
    updatedUser,
    deleteUser,
    resetPassword,
    getProfile
} = require("../controllers/userControllers.js");


const {
    analyzeResume
} = require("../controllers/aiController");



// public routes
router.post("/signup", signup);

router.post("/login", login);

// protected routes
router.put(
    "/update/:id",
    authMiddleware,
    updatedUser
);

router.delete(
    "/deleteUser/:id",
    authMiddleware,
    deleteUser
);

router.put(
    "/reset-password/:id",
    authMiddleware,
    resetPassword
);

router.get(
    "/profile",
    authMiddleware,
    getProfile
);


router.post("/analyze-resume",analyzeResume)
module.exports = router;