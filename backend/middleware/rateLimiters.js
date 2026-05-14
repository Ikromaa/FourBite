import rateLimit from 'express-rate-limit';

const authLimitMessage = {
    success: false,
    message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.',
};

export const userAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: authLimitMessage,
});

export const adminAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: authLimitMessage,
});
