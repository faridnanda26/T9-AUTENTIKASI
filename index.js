import 'dotenv/config';

import express from 'express';
import productRoute from './src/routes/product.route.js';
import orderRoute from './src/routes/order.route.js';
import authRoute from './src/routes/auth.route.js';
import { logger } from './src/middleware/logger.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('Halo dari Express!');
});

app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error('Gagal menjalankan server:', err.message);
        process.exit(1);
    }

    console.log(`Server jalan di http://localhost:${PORT}`);
});