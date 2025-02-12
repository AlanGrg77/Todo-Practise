require("dotenv").config()
const { default: mongoose } = require("mongoose")

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MongoDB_URI)
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB