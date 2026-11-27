import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as data from '../data/user.data.js';
import { AppError } from '../utils/AppError.js';

export async function register({ email, password }) {
    if (await data.findByEmail(email)) {
        throw new AppError(409, 'Email already registered', 'DUPLICATE_EMAIL');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return data.save({ email, passwordHash });
}

function makeToken(user) {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
        { id: user.id },                                 
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
}

export async function login({ email, password }) {
    const user = await data.findByEmail(email);
    const match = user && (await bcrypt.compare(password, user.passwordHash));

    if (!match) {
        throw new AppError(401, 'Incorrect email or password', 'LOGIN_FAILED');
    }

    const { accessToken, refreshToken } = makeToken(user);
    await data.saveRefresh(refreshToken, user.id);       
    return { accessToken, refreshToken };
}

export async function refresh(refreshToken) {
    const saved = await data.findRefresh(refreshToken);
    if (!saved) {
        throw new AppError(401, 'The refresh token is not recognized', 'INVALID_REFRESH');
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
        throw new AppError(401, 'The refresh token is invalid or has expired', 'INVALID_REFRESH');
    }

    const user = await data.findById(payload.id);
    return {
        accessToken: jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }),
    };
}

export async function logout(refreshToken) {
    await data.deleteRefresh(refreshToken);
}