import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { clearAuthCookie, setAuthCookie } from '../utils/authCookies.js';

export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cek email
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        // Cek password dgn bcrypt
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email atau password salah' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        setAuthCookie(req, res, 'adminToken', token);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const adminLogout = (req, res) => {
    clearAuthCookie(req, res, 'adminToken');
    return res.status(200).json({ success: true });
};
