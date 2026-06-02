const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: String,

    email: String,

    role: String,

    score: String,

    strengths: [String],

    weaknesses: [String],

    suggestions: [String]

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "Interview",
        interviewSchema
    );