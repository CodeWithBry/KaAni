/**
 * farmService.js
 *
 * Service layer for farm financial data (income, expenses, profit).
 *
 * Expected DB tables:
 *
 *   farm_income
 *     id, user_id, amount NUMERIC, source TEXT, date DATE, created_at
 *
 *   farm_expenses
 *     id, user_id, amount NUMERIC, category TEXT, date DATE, created_at
 */

import { pool } from '../db.js';

/* ─── Monthly summary ─────────────────────────────────────────── */
async function getMonthlyIncome({ userId, year, month }) {
    // Default to current month
    const y = year  || new Date().getFullYear();
    const m = month || new Date().getMonth() + 1;

    const [incomeRes, expenseRes] = await Promise.all([
        pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM farm_income
             WHERE user_id = $1
               AND EXTRACT(YEAR  FROM date) = $2
               AND EXTRACT(MONTH FROM date) = $3`,
            [userId, y, m]
        ),
        pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM farm_expenses
             WHERE user_id = $1
               AND EXTRACT(YEAR  FROM date) = $2
               AND EXTRACT(MONTH FROM date) = $3`,
            [userId, y, m]
        ),
    ]);

    const income   = parseFloat(incomeRes.rows[0].total);
    const expenses = parseFloat(expenseRes.rows[0].total);
    const profit   = income - expenses;

    return { income, expenses, profit, year: y, month: m };
}

/* ─── Add income entry ────────────────────────────────────────── */
async function addIncome({ userId, amount, source, date }) {
    const { rows } = await pool.query(
        `INSERT INTO farm_income (user_id, amount, source, date)
         VALUES ($1, $2, $3, $4)
         RETURNING id, amount, source, date`,
        [userId, amount, source || 'General', date || new Date()]
    );
    return rows[0];
}

/* ─── Add expense entry ───────────────────────────────────────── */
async function addExpense({ userId, amount, category, date }) {
    const { rows } = await pool.query(
        `INSERT INTO farm_expenses (user_id, amount, category, date)
         VALUES ($1, $2, $3, $4)
         RETURNING id, amount, category, date`,
        [userId, amount, category || 'General', date || new Date()]
    );
    return rows[0];
}

export { getMonthlyIncome, addIncome, addExpense };
