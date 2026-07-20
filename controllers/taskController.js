/**
 * taskController.js
 *
 * Assumes req.user is set by your existing auth middleware (e.g. verifyToken).
 */

import * as taskService from '../services/taskService.js';

/* GET /api/tasks?date=YYYY-MM-DD */
async function getAll(req, res) {
    try {
        const userId = req.user.id;
        const { date } = req.query;
        const tasks = await taskService.getTasks({ userId, date });
        res.json(tasks);
    } catch (err) {
        console.error('[tasks] getAll:', err.message);
        res.status(500).json({ error: 'Could not fetch tasks.' });
    }
}

/* GET /api/tasks/:id */
async function getOne(req, res) {
    try {
        const task = await taskService.getTaskById({
            userId: req.user.id,
            taskId: parseInt(req.params.id),
        });
        if (!task) return res.status(404).json({ error: 'Task not found.' });
        res.json(task);
    } catch (err) {
        console.error('[tasks] getOne:', err.message);
        res.status(500).json({ error: 'Could not fetch task.' });
    }
}

/* POST /api/tasks
   Body: { title, date, time?, category?, urgent? } */
async function create(req, res) {
    try {
        const { title, date, time, category, urgent } = req.body;
        if (!title || !date) {
            return res.status(400).json({ error: 'title and date are required.' });
        }
        const task = await taskService.createTask({
            userId: req.user.id,
            title, date, time, category, urgent,
        });
        res.status(201).json(task);
    } catch (err) {
        console.error('[tasks] create:', err.message);
        res.status(500).json({ error: 'Could not create task.' });
    }
}

/* PATCH /api/tasks/:id
   Body: any subset of { title, date, time, category, urgent, done } */
async function update(req, res) {
    try {
        const task = await taskService.updateTask({
            userId: req.user.id,
            taskId: parseInt(req.params.id),
            fields: req.body,
        });
        if (!task) return res.status(404).json({ error: 'Task not found.' });
        res.json(task);
    } catch (err) {
        console.error('[tasks] update:', err.message);
        res.status(500).json({ error: 'Could not update task.' });
    }
}

/* DELETE /api/tasks/:id */
async function remove(req, res) {
    try {
        const deleted = await taskService.deleteTask({
            userId: req.user.id,
            taskId: parseInt(req.params.id),
        });
        if (!deleted) return res.status(404).json({ error: 'Task not found.' });
        res.json({ success: true });
    } catch (err) {
        console.error('[tasks] remove:', err.message);
        res.status(500).json({ error: 'Could not delete task.' });
    }
}

export { getAll, getOne, create, update, remove };
