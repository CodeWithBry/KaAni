/**
 * routes/market.js
 *
 * Mount at: app.use('/api/market', require('./routes/market'))
 *
 * GET prices is public. POST requires auth (add verifyToken if needed).
 */

import express from 'express';
const router  = express.Router();
import { getPrices, upsertPrice } from '../controllers/marketController.js';

// GET  /api/market/prices?location=...
router.get('/prices', getPrices);

// POST /api/market/prices   — admin/data-entry endpoint
router.post('/prices', upsertPrice);

export default router;
