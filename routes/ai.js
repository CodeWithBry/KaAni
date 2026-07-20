/**
 * routes/ai.js
 *
 * Mount at: app.use('/api/ai', require('./routes/ai'))
 *
 * Chat is intentionally not behind verifyToken so offline/guest users
 * can still ask basic questions. Add verifyToken if you want it locked.
 */

import express from 'express';
const router  = express.Router();
import { chat } from '../controllers/aiController.js';

// POST /api/ai/chat
// Body: { message: string, history?: [{role, content}] }
router.post('/chat', chat);

export default router;
