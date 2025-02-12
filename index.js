const express = require("express")
const cors = require("cors")
const authRouter = require("./routes/authRoute")
const connectDB = require("./db/db")
const todoRouter = require("./routes/todoRoute")

const app = express()

app.use(express.json())

connectDB()

app.use(cors({
    origin :  "*"
}))

app.use('/api/auth', authRouter)
app.use('/api/todo', todoRouter)

app.listen(3000,()=>{
    console.log("Server started at 3000")
})