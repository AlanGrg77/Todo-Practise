require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const z = require("zod")
const { UserModel } = require("../Schema/Todo")



const generateToken = (userId)=>{
    const token = jwt.sign({userId : userId},process.env.Jwt_Secret, {expiresIn : '2hr'})
    return token
}

class AuthController{
    static signup = async (req,res) =>{
        const {username, password, confirm, email} = req.body
        const signupSchema = z.object({
            username : z.string()
            .min(1, "Username is required") // Prevent empty input
            .min(3, "Username must be at least 3 characters long")
            .max(10, "Username must be at max 10 characters long")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores" ),
            // Zod methods:  schema methos eg: string() or Refinements (Constraints) eg : min(),max(),gt()
            email : z.string()
            .email()
            .min(1, "Email is required") // Prevent empty input
            .transform((value)=> value.trim().toLowerCase()), //vlaue or data both works

            password : z.string()
            .min(1, "Password is required") // Prevent empty input
            .min(3, "Password must be at least 3 characters long")
            .max(10, "Password must be at max 10 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[\W_]/, "Password must contain at least one special character (!@#$%^&*)"),

            confirm : z.string()
            .min(1, "Confirm password is required") // Prevent empty input,
            
        })
        .refine((data)=> data.password === data.confirm, {
            message : "Confirm passoword doesn't match",
            path : ["confirm"]
        })
        const result = signupSchema.safeParse(req.body)
        if(!result.success){
            return res.status(403).json({
                message : "Invalid input",
                error : result.error
            })
        }
        const hasedPassword = await bcrypt.hash(password,10)

        const success = await UserModel.create({
            username,
            email,
            password : hasedPassword
        })

        if(success){
            res.status(200).json({
                message : "Your signed up",
            })
            return
        }
    }
    static signin = async (req,res) =>{
        const {email, password} = req.body
        const signinSchema = z.object({
            email : z.string()
            .email()
            .min(1, "Email is required") // Prevent empty input
            .transform((value)=> value.trim().toLowerCase()), //vlaue or data both works

            password : z.string()
            .min(1, "Password is required") // Prevent empty input
            .min(3, "Password must be at least 3 characters long")
            .max(10, "Password must be at max 10 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[\W_]/, "Password must contain at least one special character (!@#$%^&*)")
        })
        const result = signinSchema.safeParse(req.body)
        if(!result.success){
            return res.status(403).json({
                message : "Invalid input",
                error : result.error
            })
        }
        const user = await UserModel.findOne({
            email
        })
        if(!user){
            res.status(404).json({
                message : "No user with this email"
            })
            return
        }
        const checkPassword = await bcrypt.compare(password,user.password)

        if(checkPassword){
            const token = generateToken(user._id)
            console.log(token)
            return res.status(200).json({
                message : "Your are signed in", 
                token
            })
        }
        else {
            return res.status(403).json({
                message : "Invalid password"
            })
        }
    } 
} 

module.exports = AuthController

//Hi123