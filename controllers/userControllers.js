const express = require('express')
const User = require("../models/userSchema.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//signup
const signup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Empty field validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Signup successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

//login

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and Password are required"
            });

        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message: "Invalid email format"
            });

        }

        // Check user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Credentials"
            });

        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Credentials"
            });

        }

        // Generate JWT Token
        const token = jwt.sign(

            { id: user._id },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        // Success Response
        res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    login
};




// Update User

const updatedUser = async (req, res) => {

    try {

        const { id } = req.params;

        // Authorization Check
        if (req.user.id !== id) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }

        const { name, email } = req.body;

        // Validation
        if (!name || !email) {

            return res.status(400).json({
                message: "Name and Email are required"
            });

        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message: "Invalid Email Format"
            });

        }

        const updatedUser = await User.findByIdAndUpdate(

            id,

            {
                name,
                email
            },

            {
                new: true
            }

        ).select("-password");

        if (!updatedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({

            message: "User Updated Successfully",

            user: updatedUser

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};



// Delete User

const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        // Authorization Check
        if (req.user.id !== id) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }

        const deletedUser =
            await User.findById(id);

        if (!deletedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};



// Reset Password

const resetPassword = async (req, res) => {

    try {

        const { id } = req.params;

        const { newpassword } = req.body;

        // Authorization Check
        if (req.user.id !== id) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }

        // Validation
        if (!newpassword) {

            return res.status(400).json({
                message: "Password is required"
            });

        }

        if (newpassword.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });

        }

        const user = await User.findById(id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const hashedPassword =
            await bcrypt.hash(
                newpassword,
                10
            );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: err.message
        });

    }

};



// Get Profile

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        ).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


module.exports = {
    signup,
    login,
    updatedUser,
    deleteUser,
    resetPassword,
    getProfile
};