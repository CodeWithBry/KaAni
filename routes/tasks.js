/**
 * routes/tasks.js
 *
 * Mount at: app.use('/api/tasks', verifyToken, require('./routes/tasks'))
 *
 * All routes require authentication (verifyToken middleware applied at mount).
 */

import express from 'express';
const router  = express.Router();
import {
    getAll, getOne, create, update, remove,
} from '../controllers/taskController.js';

// GET  /api/tasks?date=YYYY-MM-DD   — all tasks (optionally filtered by date)
router.get('/',     getAll);

// GET  /api/tasks/:id
router.get('/:id',  getOne);

// POST /api/tasks
router.post('/',    create);

// PATCH /api/tasks/:id
router.patch('/:id', update);

// DELETE /api/tasks/:id
router.delete('/:id', remove);

export default router;
