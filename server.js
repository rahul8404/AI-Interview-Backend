require("dotenv").config();
const express = require('express')
const cors = require("cors");
const db = require('./middlewares/db.js')
const authRoutes = require("./routes/userRoute.js")
const aiRoutes = require("./routes/aiRoutes.js")


const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://ai-interview-frontend-six-lovat.vercel.app"
    ];

    // allow tools like Postman / mobile apps
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// handle preflight globally (SAFE WAY)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

db();

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);

})

