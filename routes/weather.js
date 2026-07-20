/**
 * routes/weather.js
 *
 * Mount at: app.use('/api/weather', require('./routes/weather'))
 *
 * No auth required — weather is public.
 */

import express from 'express';
const router  = express.Router();
import { getCurrent, getFull } from '../controllers/weatherController.js';

// GET /api/weather/current   — lightweight, for Dashboard card
router.get('/current', getCurrent);

// GET /api/weather/full      — full 72-hour + crops, for Weather page
router.get('/full', getFull);

export default router;
