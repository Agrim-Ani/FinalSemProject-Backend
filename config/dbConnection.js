const mongoose = require('mongoose')

const dotenv = require('dotenv').config()
mongoose.set('strictQuery', true)
const connectDb = async()=>{
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("DATABASE is CONNECTED")
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
};

module.exports = connectDb; 