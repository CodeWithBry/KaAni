/**
 * marketService.js
 *
 * Service layer for local market price data.
 *
 * Expected DB table: market_prices
 *   id, commodity TEXT, price_per_kg NUMERIC, change_pct NUMERIC,
 *   recorded_date DATE, location TEXT, created_at TIMESTAMPTZ
 *
 * If you integrate with a public market price API (e.g. DA / PSA),
 * add a fetchAndSyncPrices() function here that populates the table.
 */

import { pool } from '../db.js';

/* ─── Get today's prices (latest per commodity) ───────────────── */
async function getTodayPrices({ location } = {}) {
    const params = [];
    let locationFilter = '';

    if (location) {
        params.push(location);
        locationFilter = `AND mp.location = $1`;
    }

    /* Latest price row per commodity */
    const { rows } = await pool.query(
        `SELECT DISTINCT ON (mp.commodity)
            mp.commodity  AS name,
            mp.price_per_kg AS price,
            mp.change_pct   AS change,
            mp.location,
            mp.recorded_date
         FROM market_prices mp
         ${locationFilter}
         ORDER BY mp.commodity, mp.recorded_date DESC`,
        params
    );

    return rows.map(r => ({
        name:   r.name,
        price:  parseFloat(r.price),
        change: parseFloat(r.change ?? 0),
    }));
}

/* ─── Upsert a price entry (admin/sync use) ───────────────────── */
async function upsertPrice({ commodity, price_per_kg, change_pct, location, recorded_date }) {
    const { rows } = await pool.query(
        `INSERT INTO market_prices (commodity, price_per_kg, change_pct, location, recorded_date)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (commodity, location, recorded_date)
         DO UPDATE SET price_per_kg = EXCLUDED.price_per_kg,
                       change_pct   = EXCLUDED.change_pct
         RETURNING *`,
        [commodity, price_per_kg, change_pct ?? 0, location || 'Brgy. San Isidro', recorded_date || new Date()]
    );
    return rows[0];
}

export { getTodayPrices, upsertPrice };
