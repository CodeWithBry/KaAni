/**
 * aiController.js
 */

import * as aiService from '../services/aiService.js';

/**
 * POST /api/ai/chat
 * Body: { message: string, history?: Array<{role, content}> }
 */
async function chat(req, res) {
    try {
        const { message, history } = req.body;
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'message is required.' });
        }
        const result = await aiService.chat({ message: message.trim(), history });
        res.json(result);
    } catch (err) {
        console.error('[ai] chat:', err.message);
        res.status(502).json({ error: 'AI assistant is unavailable right now.' });
    }
}

export { chat };
