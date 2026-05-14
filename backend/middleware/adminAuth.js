import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.adminToken;

    if (!cookieToken && (!authHeader || !authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const token = cookieToken || authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pastikan token ini milik admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Token sudah kedaluwarsa' : 'Token tidak valid';
        return res.status(401).json({ success: false, message });
    }
};

export default adminAuth;
