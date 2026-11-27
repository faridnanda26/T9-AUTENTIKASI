import * as service from '../services/product.service.js';

export async function all(req, res) {
    res.json(await service.all(req.query));
}

export async function detail(req, res) {
    const p = await service.detail(req.params.id);
    res.json({ data: p });
}

export async function reviews(req, res) {
    const p = await service.reviews(req.params.id);
    res.json({ data: p });
}

export async function create(req, res) {
    const p = await service.create(req.body);
    res.status(201).json({ data: p });
}

export async function update(req, res) {
    const p = await service.update(req.params.id, req.body);
    res.json({ data: p });
}

export async function deleteProduct(req, res) {
    await service.deleteProduct(req.params.id);
    res.status(204).end();
}