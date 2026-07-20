/**
 * weatherController.js
 */

import { getCurrentWeather, getFullWeather } from '../services/weatherService.js';

/**
 * GET /api/weather/current
 * Lightweight — used by the Dashboard weather card.
 */
async function getCurrent(req, res) {
    try {
        const { lat, lon } = req.query;
        const data = await getCurrentWeather(
            lat ? parseFloat(lat) : undefined,
            lon ? parseFloat(lon) : undefined
        );
        res.json(data);
    } catch (err) {
        console.error('[weather] getCurrent:', err.message);
        res.status(502).json({ error: 'Could not fetch weather data.' });
    }
}

/**
 * GET /api/weather/full
 * Full payload — hourly forecast + crop suitability. Used by weather.html.
 */
async function getFull(req, res) {
    try {
        const { lat, lon } = req.query;
        const data = await getFullWeather(
            lat ? parseFloat(lat) : undefined,
            lon ? parseFloat(lon) : undefined
        );
        res.json(data);
    } catch (err) {
        console.error('[weather] getFull:', err.message);
        res.status(502).json({ error: 'Could not fetch full weather data.' });
    }
}

export { getCurrent, getFull };
