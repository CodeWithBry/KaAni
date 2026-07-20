/**
 * weatherService.js
 *
 * Wraps an external weather API (Open-Meteo used here — free, no API key needed).
 * Swap BASE_URL / parseXxx functions if you use a different provider.
 *
 * Open-Meteo docs: https://open-meteo.com/en/docs
 */

import https from 'https';

/* ─── config ─────────────────────────────────────────────────── */
// Default coords: Brgy. San Isidro (adjust to actual barangay lat/lon)
const DEFAULT_LAT = 14.0583;
const DEFAULT_LON = 121.3250;
const DEFAULT_LOCATION = 'Brgy. San Isidro';

/* WMO weather interpretation codes → human labels */
const WMO_CODE = {
    0:  { label: 'Sunny',         condition: 'sunny' },
    1:  { label: 'Mostly clear',  condition: 'sunny' },
    2:  { label: 'Partly cloudy', condition: 'partly cloudy' },
    3:  { label: 'Cloudy',        condition: 'cloudy' },
    45: { label: 'Foggy',         condition: 'cloudy' },
    48: { label: 'Icy fog',       condition: 'cloudy' },
    51: { label: 'Light drizzle', condition: 'rainy' },
    53: { label: 'Drizzle',       condition: 'rainy' },
    55: { label: 'Heavy drizzle', condition: 'rainy' },
    61: { label: 'Light rain',    condition: 'rainy' },
    63: { label: 'Moderate rain', condition: 'rainy' },
    65: { label: 'Heavy rain',    condition: 'rainy' },
    80: { label: 'Rain showers',  condition: 'rainy' },
    81: { label: 'Heavy showers', condition: 'rainy' },
    95: { label: 'Thunderstorm',  condition: 'rainy' },
    99: { label: 'Heavy storm',   condition: 'rainy' },
};

function interpretCode(code) {
    return WMO_CODE[code] || { label: 'Variable', condition: 'cloudy' };
}

/* ─── http helper (no external dep, uses built-in https) ─────── */
function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let raw = '';
            res.on('data', d => raw += d);
            res.on('end', () => {
                try { resolve(JSON.parse(raw)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

/* ─── crop suitability rules ─────────────────────────────────── */
function cropSuitability(avgTemp, maxRain) {
    return [
        {
            name: 'Palay (Rice)',
            status: avgTemp >= 24 && avgTemp <= 35 && maxRain > 20
                ? 'recommended' : avgTemp < 20 ? 'avoid' : 'caution'
        },
        {
            name: 'Talong (Eggplant)',
            status: avgTemp >= 22 && avgTemp <= 32 && maxRain < 70
                ? 'recommended' : 'caution'
        },
        {
            name: 'Sibuyas (Onion)',
            status: maxRain > 60 ? 'avoid' : avgTemp < 28 ? 'recommended' : 'caution'
        },
        {
            name: 'Kamote (Sweet potato)',
            status: avgTemp >= 21 && avgTemp <= 34 ? 'recommended' : 'caution'
        },
        {
            name: 'Saging (Banana)',
            status: avgTemp >= 25 && maxRain < 80 ? 'recommended' : 'caution'
        },
    ];
}

/* ─── exported functions ─────────────────────────────────────── */

/**
 * getCurrentWeather()
 * Returns { temperature, description, condition, location }
 */
async function getCurrentWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
    const url = `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weathercode` +
        `&timezone=Asia%2FManila`;

    const data = await httpGet(url);
    const temp = Math.round(data.current.temperature_2m);
    const { label, condition } = interpretCode(data.current.weathercode);

    return {
        temperature: temp,
        description: label,
        condition,
        location: DEFAULT_LOCATION,
    };
}

/**
 * getFullWeather()
 * Returns { current, hourly (next 8 slots), crops, location }
 */
async function getFullWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
    const url = `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weathercode` +
        `&hourly=temperature_2m,weathercode,precipitation_probability` +
        `&forecast_days=3` +
        `&timezone=Asia%2FManila`;

    const data = await httpGet(url);

    const current = {
        temperature: Math.round(data.current.temperature_2m),
        ...interpretCode(data.current.weathercode),
    };

    /* pick the next 8 hourly slots starting from the current hour */
    const nowHour = new Date().getHours();
    const hourly = [];
    const times = data.hourly.time;

    for (let i = 0; i < times.length && hourly.length < 8; i++) {
        const h = new Date(times[i]).getHours();
        const d = new Date(times[i]).getDate();
        const today = new Date().getDate();
        if (d === today && h < nowHour) continue;

        const label = new Date(times[i]).toLocaleTimeString('en-PH', {
            hour: 'numeric', hour12: true
        });
        hourly.push({
            label,
            temperature: Math.round(data.hourly.temperature_2m[i]),
            rain_chance: data.hourly.precipitation_probability[i] ?? 0,
            condition: interpretCode(data.hourly.weathercode[i]).condition,
        });
    }

    /* compute crop suitability from next-24h data */
    const next24Temps = data.hourly.temperature_2m.slice(nowHour, nowHour + 24);
    const next24Rain  = data.hourly.precipitation_probability.slice(nowHour, nowHour + 24);
    const avgTemp = next24Temps.reduce((a, b) => a + b, 0) / next24Temps.length;
    const maxRain = Math.max(...next24Rain);

    return {
        location: DEFAULT_LOCATION,
        current,
        hourly,
        crops: cropSuitability(avgTemp, maxRain),
    };
}

export { getCurrentWeather, getFullWeather };
