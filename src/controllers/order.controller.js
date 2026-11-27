import * as service from '../services/order.service.js';

export async function all(req, res) {
    const orders = await service.allOrders();

    res.json( {data: orders} );
}

export async function create(req, res) {
    const order = await service.createOrder(req.body);

    res.status(201).json( {data: order} );
}