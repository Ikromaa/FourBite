import express from "express"
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js'
import { userAuthLimiter } from '../middleware/rateLimiters.js'


const userRouter = express.Router()


userRouter.post('/register', userAuthLimiter, registerUser)
userRouter.post('/login', userAuthLimiter, loginUser)
userRouter.post('/logout', logoutUser)

export default userRouter
