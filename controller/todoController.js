const { TodoModel } = require("../Schema/Todo")

class todoController {
    static createTodo = async (req,res) =>{
        const userId = req.userId
        const {title} = req.body
        await TodoModel.create({
            title,
            userId
        })
        res.status(200).json({
            message : "Todo task created successfully"
        })
    }
    
    static getTodos = async (req,res) =>{
        const userId = req.userId
        console.log("User ID from request:", userId);
        const todoData = await TodoModel.find({
            userId
        })
        console.log(todoData)
        if(!todoData){
            res.status(404).json({
                message : "no todo with this id"
            })
        }
        else{
            res.status(200).json({
                message : "todo fetched successfully",
                data : todoData
            })
        }
    }
}
module.exports = todoController