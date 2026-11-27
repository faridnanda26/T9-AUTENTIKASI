import { prisma } from '../lib/prisma.js';

export function allOrders() {
    return prisma.order.findMany({
        select: {
            id: true,
            quantity: true,
            total: true,
            createdAt: true,
            product: {
                select: {
                    name: true,
                    price: true,
                },
            },
        },
    });
}
