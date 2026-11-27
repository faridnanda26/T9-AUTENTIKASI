import { prisma } from '../lib/prisma.js';

export function allProduct({ where, orderBy, skip, take }) {
  return prisma.product.findMany({ where, orderBy, skip, take });
}

export function countProduct(where) {
  return prisma.product.count({ where });
}

export async function getProductById(id) {
    return prisma.product.findUnique({where: {id}});
}

export async function getProductByName(name) {
    return prisma.product.findUnique({where: {name}});
}

export async function getProductReviews(id) {
    return prisma.product.findUnique({ where: { id: id }, include: { reviews: true } });
}

export async function create(input) {
    return prisma.product.create({ data: input });
}

export async function update(id, input) {
    return prisma.product.update({ where: {id}, data: input });
}

export async function deleteProduct(id) {
    return prisma.product.delete({ where: {id} });
}