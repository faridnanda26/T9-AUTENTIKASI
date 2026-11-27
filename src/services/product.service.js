import * as data from '../data/product.data.js';
import { AppError} from '../utils/AppError.js'

const ORDER_COLUMNS = ['name', 'price', 'stock'];

export async function all(query) {
    const { minPrice, stock, category, find, order = 'name', sort = 'asc'} = query;

    const page = Math.max(Number(query.page) || 1, 1);
    const size = Math.min(Math.max(Number(query.size) || 10, 1), 100);

    if(!ORDER_COLUMNS.includes(order)) {
        throw new AppError(400, `The sort must be one of the following: ${ORDER_COLUMNS.join(', ')}`, 'INVALID_QUERY');
    }

    const where = {
        ...(minPrice && { price: { gte: Number(minPrice)} }),
        ...(stock && { stock: Number(stock) }),
        ...(find && { name: { contains: find } }),
        ...(category && { category: category }),
    };

    const [result, total] = await Promise.all([
        data.allProduct({
            where,
            orderBy: { [order]: sort === 'desc' ? 'desc' : 'asc' },
            skip: (page - 1) * size,
            take: size,
        }),
        data.countProduct(where),
    ]);

    return {
        data: result,
        meta: {
            page,
            size,
            total,
            totalPages: Math.ceil(total / size)
        },
    }
}

function getId(id) {
    const idNumber = Number(id);
    if (!Number.isInteger(idNumber)) {
        throw new AppError(400, 'id must be an integer', 'INVALID_ID');
    }
    return idNumber;
}

export async function detail(id) {
    const p = await data.getProductById(getId(id));

    if(!p) {
        throw new AppError(404, "Product not available", "NOT_FOUND");
    }

    return p;
}

export async function reviews(id) {
    const p = await data.getProductReviews(getId(id));

    if(!p) {
        throw new AppError(404, "Product not available", "NOT_FOUND");
    }

    return p;
}

export async function create(input) {
    if (await data.getProductByName(input.name)) {
        throw new AppError(409, `Name ${input.name} is already registered`, 'DUPLICATE_NAME');
    }

    try {
        return data.create(input);
    } catch (error) {
        if(error.code === 'P2002') {
            throw new AppError(409, `Name ${input.name} is already registered`, 'DUPLICATE_NAME');
        }
        throw error;
    }
}

export async function update(id, input) {
    const old = await detail(id);
    const conflict = await data.getProductByName(input.name);

    if (conflict && conflict.id !== old.id) {
        throw new AppError(409, `Name ${input.name} is already registered`, 'DUPLICATE_NAME');
    }
    
    const p = await data.update(old.id, input);
    return p;
}

export async function deleteProduct(id) {
    const p = await detail(id);
    return data.deleteProduct(p.id);
}