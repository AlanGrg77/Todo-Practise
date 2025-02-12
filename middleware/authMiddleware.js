require("dotenv").config()
const jwt = require("jsonwebtoken")

const auth = (req,res,next) => {
    const token = req.headers.authorization
    console.log(token)
    if(!token){
        res.status(400).json({
            message : "Token not provided"
        })
        return
    }
    jwt.verify(token,process.env.Jwt_Secret, async(err,decoded) => {
        if(err){
            res.status(403).json({
                message : "Invalid token",
                err
            })
        }
        else{
           req.userId =  decoded.userId
           next()
        }
    })
}

module.exports = auth