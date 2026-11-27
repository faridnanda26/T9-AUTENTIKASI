import * as service from '../services/auth.service.js';

export async function register(req, res) {
    const user = await service.register(req.body);
    res.status(201).json({ data: user });
}

export async function login(req, res) {
    const result = await service.login(req.body);
    res.json({ data: result });
}

export function saya(req, res) {
    res.json({ data: req.user });
}

export async function refresh(req, res) {
    res.json({ data: await service.refresh(req.body.refreshToken) });
}

export async function logout(req, res) {
    await service.logout(req.body.refreshToken);
    res.status(204).end();
}