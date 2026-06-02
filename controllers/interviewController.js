const axios = require("axios");
const Interview = require("../models/Interview");
const User = require("../models/userSchema");
const interview = require("../models/interview");


// ===============================
// Generate Questions
// ===============================
const generateQuestions = async (req, res) => {
    try {
        const { role } = req.body;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `
Generate 5 interview questions for ${role}.

Return ONLY valid JSON in this format:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}
`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiText = response.data.choices[0].message.content;

        const cleanedText = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(cleanedText);

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.log("Generate Questions Error:", err.message);

        return res.status(500).json({
            success: false,
            message: "Question Generation Error"
        });
    }
};


// ===============================
// Evaluate Interview
// ===============================
const evaluateInterview = async (req, res) => {
    try {
        const { role, questions, answers } = req.body;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `
Evaluate these interview answers.

Questions:
${JSON.stringify(questions, null, 2)}

Answers:
${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON in this format:

{
  "score": "85%",
  "strengths": ["Strong Java fundamentals"],
  "weaknesses": ["Need improvement in OOP concepts"],
  "suggestions": ["Practice Collections Framework"]
}
`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let aiText = response.data.choices[0].message.content;

        const cleanedText = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("AI Response:", cleanedText);

        const data = JSON.parse(cleanedText);

        // ===============================
        // SAVE TO DB (ONLY IF USER EXISTS)
        // ===============================
        if (req.user?.id) {
            const user = await User.findById(req.user.id);

            if (user) {
                await Interview.create({
                    user: user._id,
                    name: user.name,
                    email: user.email,
                    role,
                    score: data.score,
                    strengths: data.strengths,
                    weaknesses: data.weaknesses,
                    suggestions: data.suggestions
                });
            }
        }

        // ===============================
        // SEND RESPONSE TO FRONTEND
        // ===============================
        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.log("Evaluate Interview Error:", err.message);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


//generate Interview History 

const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await interview.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });
        res.status(200).json(interviews)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "server Error"
        })


    }
};

//delete function 


const deleteInterviewHistory = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            })
        }

        await Interview.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Interview deleted Successfully"
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });


    }
}
module.exports = {
    generateQuestions,
    evaluateInterview,
    getInterviewHistory,
    deleteInterviewHistory
};