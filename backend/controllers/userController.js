import userModel from "../modals/userModal.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookies.js';


// LOGIN FUNCTION
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({success: false, message: 'Username Tidak Ditemukan'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: 'Password Salah'})
        }

        const token = createToken(user._id);
        setAuthCookie(req, res, 'token', token);
        res.json({ success: true, user: { email: user.email, username: user.username } })
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Terjadi Kesalahan pada server'})
    }
}

// CREATE TOKEN FUNCTION
const createToken  = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// REGISTER FUNCTION
const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const exists = await userModel.findOne({ email })
        if (exists) {
            // return 
            return res.json({success: false, message: 'Email sudah terdaftar'})
        }

        // VALIDATION
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Email tidak valid'})
        }

        if(password.length < 8) {
            return res.json({success: false, message: 'Password harus memiliki minimal 8 karakter'})
        }

        // IF VALIDATION IS SUCCESS
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // NEW USER
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        setAuthCookie(req, res, 'token', token);
        res.json({ success: true, user: { email: user.email, username: user.username } })
    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Terjadi Kesalahan pada server'})
    }
}

const logoutUser = (req, res) => {
    clearAuthCookie(req, res, 'token');
    res.json({ success: true });
}

export {loginUser,registerUser, logoutUser}

