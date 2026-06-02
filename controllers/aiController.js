const axios = require("axios");
const pdfParse = require("pdf-parse");
const Analysis = require("../models/Analysis.js")
const User = require("../models/userSchema.js")

const analyzeResume = async (req, res) => {

    try {

        let resumeText = req.body.resumeText;

        // PDF Upload Handling
        if (req.file) {

            const pdfData = await pdfParse(
                req.file.buffer
            );

            resumeText = pdfData.text;

        }

        // OpenRouter AI Request
        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-3.5-turbo",

                messages: [
                    {
                        role: "user",

                        content: `
You are an ATS Resume Analyzer AI.

Return ONLY pure valid JSON.

Do NOT write markdown.
Do NOT write explanation.
Do NOT use backticks.

Format:

{
  "atsScore":"85%",
  "strengths":[
    "strength 1",
    "strength 2"
  ],
  "weaknesses":[
    "weakness 1"
  ],
  "missingSkills":[
    "skill 1"
  ],
  "suggestions":[
    "suggestion 1"
  ]
}

Analyze this resume:

${resumeText}
`
                    }
                ]
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                        "application/json"

                }
            }

        );

        // AI Response Text
        const aiText =
            response.data.choices[0].message.content;

        // Clean Response
        const cleanedText = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Convert String → JSON
        const parsedData =
            JSON.parse(cleanedText);

        const user = await User.findById(
            req.user.id
        );

        await Analysis.create({

            user: req.user.id,
            name: user.name,
            email: user.email,

            atsScore:
                parsedData.atsScore,

            strengths:
                parsedData.strengths,

            weaknesses:
                parsedData.weaknesses,

            missingSkills:
                parsedData.missingSkills,

            suggestions:
                parsedData.suggestions

        });

        // Send Final Response
        res.status(200).json({

            response: parsedData

        });

    } catch (err) {

        console.log(
            err.response?.data || err.message
        );

        res.status(500).json({
            message: "AI Error"
        });

    }

};





const getHistory = async (req, res) => {

    try {

        const history = await Analysis.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        res.status(200).json(history);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


const deleteHistory = async (req, res) => {

    try {

        await Analysis.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "History deleted"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


module.exports = {
    analyzeResume,
    getHistory,
    deleteHistory
};