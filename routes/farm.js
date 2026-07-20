/**
 * routes/farm.js
 *
 * Mount at: app.use('/api/farm', verifyToken, require('./routes/farm'))
 */

import express from 'express';
const router  = express.Router();
import {
    getMonthlyIncome, addIncome, addExpense,
} from '../controllers/farmController.js';

// GET  /api/farm/income/monthly?year=2025&month=7
router.get('/income/monthly', getMonthlyIncome);

// POST /api/farm/income   — log a new income entry
router.post('/income',  addIncome);

// POST /api/farm/expense  — log a new expense entry
router.post('/expense', addExpense);

export default router;
