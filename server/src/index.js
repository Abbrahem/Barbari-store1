import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import { db as firestore } from './firebaseAdmin.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'shevoo-server', time: new Date().toISOString() });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Shevoo server running on http://localhost:${PORT}`);
});
