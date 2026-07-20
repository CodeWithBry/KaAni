/**
 * farmController.js
 */

import * as farmService from '../services/farmService.js';

/* GET /api/farm/income/monthly?year=2025&month=7 */
async function getMonthlyIncome(req, res) {
    try {
        const userId = req.user.id;
        const { year, month } = req.query;
        const summary = await farmService.getMonthlyIncome({
            userId,
            year:  year  ? parseInt(year)  : undefined,
            month: month ? parseInt(month) : undefined,
        });
        res.json(summary);
    } catch (err) {
        console.error('[farm] getMonthlyIncome:', err.message);
        res.status(500).json({ error: 'Could not fetch income data.' });
    }
}

/* POST /api/farm/income
   Body: { amount, source?, date? } */
async function addIncome(req, res) {
    try {
        const { amount, source, date } = req.body;
        if (!amount) return res.status(400).json({ error: 'amount is required.' });
        const entry = await farmService.addIncome({
            userId: req.user.id, amount, source, date,
        });
        res.status(201).json(entry);
    } catch (err) {
        console.error('[farm] addIncome:', err.message);
        res.status(500).json({ error: 'Could not add income entry.' });
    }
}

/* POST /api/farm/expense
   Body: { amount, category?, date? } */
async function addExpense(req, res) {
    try {
        const { amount, category, date } = req.body;
        if (!amount) return res.status(400).json({ error: 'amount is required.' });
        const entry = await farmService.addExpense({
            userId: req.user.id, amount, category, date,
        });
        res.status(201).json(entry);
    } catch (err) {
        console.error('[farm] addExpense:', err.message);
        res.status(500).json({ error: 'Could not add expense entry.' });
    }
}

export { getMonthlyIncome, addIncome, addExpense };
