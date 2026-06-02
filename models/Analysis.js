const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User"

    },

    name: String,

    email: String,

    atsScore: String,

    strengths: [String],

    weaknesses: [String],

    missingSkills: [String],

    suggestions: [String],

    createdAt: {

        type: Date,

        default: Date.now

    }

});

const Analysis = mongoose.model(
    "Analysis",
    analysisSchema
);

module.exports = Analysis;