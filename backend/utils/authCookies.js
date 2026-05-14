const sevenDays = 7 * 24 * 60 * 60 * 1000;

const isLocalRequest = (req) => {
    const origin = req.get('origin') || '';
    const host = req.hostname || '';

    return origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        host === 'localhost' ||
        host === '127.0.0.1';
};

const getCookieOptions = (req) => {
    const secureCookie = !isLocalRequest(req);

    return {
        httpOnly: true,
        secure: secureCookie,
        sameSite: secureCookie ? 'none' : 'lax',
        maxAge: sevenDays,
        path: '/',
    };
};

export const setAuthCookie = (req, res, name, token) => {
    res.cookie(name, token, getCookieOptions(req));
};

export const clearAuthCookie = (req, res, name) => {
    const options = getCookieOptions(req);
    res.clearCookie(name, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite,
        path: options.path,
    });
};
