import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export function needLogin(req, res, next) {
    const header = req.headers.authorization;         

    if (!header?.startsWith('Bearer ')) {
        return next(new AppError(401, 'Token needed', 'TOKEN_NEEDED'));
    }

    try {
        req.user = jwt.verify(header.slice(7), process.env.JWT_ACCESS_SECRET);  
        next();
    } catch (err) {
        next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
    }
}

export function needRole(...roleAllowed) {
    return (req, res, next) => {
        if (!roleAllowed.includes(req.user.role)) {
            return next(new AppError(403, 'You do not have a permit for this event', 'PROHIBITED'));
        }
        next();
    };
}