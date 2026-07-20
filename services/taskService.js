/**
 * taskService.js
 *
 * Service layer for tasks / daily objectives.
 * Replace the db calls with your actual ORM / query builder.
 * The function signatures are what the controller expects.
 *
 * Expected DB table: tasks
 *  id          SERIAL PRIMARY KEY
 *  user_id     INT NOT NULL
 *  title       TEXT NOT NULL
 *  date        DATE NOT NULL          -- YYYY-MM-DD
 *  time        TEXT                   -- e.g. "7:00 AM" (nullable)
 *  category    TEXT DEFAULT 'crop'    -- crop | boat | expense | urgent
 *  urgent      BOOLEAN DEFAULT FALSE
 *  done        BOOLEAN DEFAULT FALSE
 *  created_at  TIMESTAMPTZ DEFAULT NOW()
 */

import { pool } from '../db.js';   // your existing pg Pool export

/* ─── Get all tasks (optionally filter by date) ───────────────── */
async function getTasks({ userId, date } = {}) {
    let query = `
        SELECT id, title, date, time, category, urgent, done
        FROM tasks
        WHERE user_id = $1
    `;
    const params = [userId];

    if (date) {
        query += ` AND date = $2`;
        params.push(date);
    }

    query += ` ORDER BY date ASC, time ASC`;

    const { rows } = await pool.query(query, params);
    return rows.map(r => ({
        ...r,
        date: r.date.toISOString().split('T')[0],
    }));
}

/* ─── Get a single task ───────────────────────────────────────── */
async function getTaskById({ userId, taskId }) {
    const { rows } = await pool.query(
        `SELECT id, title, date, time, category, urgent, done
         FROM tasks
         WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return { ...r, date: r.date.toISOString().split('T')[0] };
}

/* ─── Create a task ───────────────────────────────────────────── */
async function createTask({ userId, title, date, time, category, urgent }) {
    const { rows } = await pool.query(
        `INSERT INTO tasks (user_id, title, date, time, category, urgent)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, title, date, time, category, urgent, done`,
        [userId, title, date, time || null, category || 'crop', urgent || false]
    );
    const r = rows[0];
    return { ...r, date: r.date.toISOString().split('T')[0] };
}

/* ─── Update (patch) a task ───────────────────────────────────── */
async function updateTask({ userId, taskId, fields }) {
    /* Only allow safe columns to be updated */
    const allowed = ['title', 'date', 'time', 'category', 'urgent', 'done'];
    const setClauses = [];
    const params = [];

    for (const key of allowed) {
        if (key in fields) {
            params.push(fields[key]);
            setClauses.push(`${key} = $${params.length}`);
        }
    }

    if (!setClauses.length) return null;

    params.push(taskId, userId);
    const { rows } = await pool.query(
        `UPDATE tasks
         SET ${setClauses.join(', ')}
         WHERE id = $${params.length - 1} AND user_id = $${params.length}
         RETURNING id, title, date, time, category, urgent, done`,
        params
    );
    if (!rows.length) return null;
    const r = rows[0];
    return { ...r, date: r.date.toISOString().split('T')[0] };
}

/* ─── Delete a task ───────────────────────────────────────────── */
async function deleteTask({ userId, taskId }) {
    const { rowCount } = await pool.query(
        `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    );
    return rowCount > 0;
}

export { getTasks, getTaskById, createTask, updateTask, deleteTask };
