const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');

configDotenv()

const url = process.env.DB_URL

const connectDb = async()=>{
    try{
        const db = await mongoose.connect(url);
        console.log('Db is connected');
        
    }catch(err){
        return console.log('Db Error ',err);
        
    }
}
module.exports = connectDb;