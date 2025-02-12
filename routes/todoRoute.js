const express = require("express")
const AuthController = require("../controller/authController")
const auth = require("../middleware/authMiddleware")
const todoController = require("../controller/todoController")


const todoRouter = express.Router()

todoRouter.route('/')
.post(auth, todoController.createTodo)
.get(auth, todoController.getTodos)

module.exports = todoRouter

