import { prisma } from '../lib/prisma.js';

export function findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export function save({ email, passwordHash }) {
    return prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, role: true },
    });
}

export function findById(id) {
    return prisma.user.findUnique({ where: { id } });
}

export function saveRefresh(token, userId) {
    return prisma.refreshToken.create({ data: { token, userId } });
}

export function findRefresh(token) {
    return prisma.refreshToken.findUnique({ where: { token } });
}

export function deleteRefresh(token) {
    return prisma.refreshToken.deleteMany({ where: { token } });   
}