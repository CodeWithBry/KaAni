/**
 * marketController.js
 */

import * as marketService from '../services/marketService.js';

/* GET /api/market/prices?location=Brgy.+San+Isidro */
async function getPrices(req, res) {
    try {
        const { location } = req.query;
        const prices = await marketService.getTodayPrices({ location });
        res.json(prices);
    } catch (err) {
        console.error('[market] getPrices:', err.message);
        res.status(500).json({ error: 'Could not fetch market prices.' });
    }
}

/* POST /api/market/prices  (admin / data-entry use)
   Body: { commodity, price_per_kg, change_pct?, location?, recorded_date? } */
async function upsertPrice(req, res) {
    try {
        const { commodity, price_per_kg, change_pct, location, recorded_date } = req.body;
        if (!commodity || !price_per_kg) {
            return res.status(400).json({ error: 'commodity and price_per_kg are required.' });
        }
        const entry = await marketService.upsertPrice({
            commodity, price_per_kg, change_pct, location, recorded_date,
        });
        res.status(201).json(entry);
    } catch (err) {
        console.error('[market] upsertPrice:', err.message);
        res.status(500).json({ error: 'Could not save price.' });
    }
}

export { getPrices, upsertPrice };
