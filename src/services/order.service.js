import * as data from '../data/order.data.js';
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/AppError.js';

export async function allOrders() {
    const allData = await data.allOrders();

    return allData;
}


export async function createOrder(input) {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: input.productId }
        });

        if (!product) {
            throw new AppError(
                404,
                "Product not available",
                "NOT_FOUND"
            );
        }

        if (product.stock < input.quantity) {
            throw new AppError(
                409,
                "Insufficient product stock",
                "OUT_OF_STOCK"
            );
        }

        const makeOrder = await tx.order.create({
            data: {
                quantity: input.quantity,
                total: product.price.mul(input.quantity),
                productId: input.productId
            }
        });

        await tx.product.update({
            where: { id: input.productId },
            data: {
                stock: {
                    decrement: input.quantity
                }
            }
        });

        return makeOrder;
    });
}
