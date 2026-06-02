require("dotenv").config();
const express = require('express')
const cors = require("cors");
const db = require('./middlewares/db.js')
const authRoutes = require("./routes/userRoute.js")
const aiRoutes = require("./routes/aiRoutes.js")


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

db();

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);

})

