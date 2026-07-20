import { KAANI_SYSTEM_PROMPT, getModel } from "../services/gemini.js";
import { sendError } from "../utils/response.js"

export const sendMessage = async (req, res) => {
    const { userId, message, convo } = req.body;
    if (!message || typeof message !== 'string') {
        return sendError(req, "Message is required and must be a string");
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const persona = {
            role: "model",
            parts: [{ text: KAANI_SYSTEM_PROMPT }]
        }
        const messageAI = convo ? [persona, ...convo] : [persona];
        const stream = await getModel.generateContentStream(message);
        for await (const chunk of stream.stream) {
            const text = chunk.candidates[0]?.content?.parts[0]?.text || '';

            if (text) {
                // Send chunk as Server-Sent Event
                res.write(
                    `data: ${JSON.stringify({
                        type: 'chunk',
                        content: text
                    })}\n\n`
                );

                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }

        // Send completion event
        res.write(`data: ${JSON.stringify({ type: 'done', content: '' })}\n\n`);
        console.log("completed")
        res.end();
    } catch (error) {
        console.error('Gemini API Error:', error.message);

        // Send error event
        res.write(
            `data: ${JSON.stringify({
                type: 'error',
                content: error.message || 'Failed to generate response'
            })}\n\n`
        );
        res.end();
    }
}

// async (req, res) => {

//     try {
//         // Start streaming from Gemini
//         const stream = await model.generateContentStream(message);

//         // Send opening event to client
//         res.write(`data: ${JSON.stringify({ type: 'start', content: '' })}\n\n`);

//         // Stream each chunk

//     } catch (error) {
//         console.error('Gemini API Error:', error.message);

//         // Send error event
//         res.write(
//             `data: ${JSON.stringify({
//                 type: 'error',
//                 content: error.message || 'Failed to generate response'
//             })}\n\n`
//         );
//         res.end();
//     }
// }