const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ObjectId = mongoose.ObjectId


const User = new Schema({

    username :  String,
    email : {
        type : String,
        unique : true
    },
    password : String
})

const Todo = new Schema({
    title : String,
    done : {
        type : Boolean,
        default : false
    },
    userId : ObjectId
})

const UserModel = mongoose.model("user",User)
const TodoModel = mongoose.model("todo",Todo)

module.exports = {
    UserModel,
    TodoModel
}