
import express from 'express';
import { handleChatRequest } from '../controllers/chatgptController.js';
import { ValidationError } from '../utils/errors.js';

const router = express.Router();

/**
 * POST /chatgpt
 * Endpoint to handle user prompts and related parameters for OpenAI-compatible processing.
 */
router.post('/chatgpt', async (req, res) => {
    try {
        const { prompt, actionType } = req.body;

        // Validate required fields
        if (!prompt || !actionType) {
            throw new ValidationError('Missing required fields: prompt or actionType');
        }

        // Forward the request to the chat controller
        const response = await handleChatRequest({ prompt, actionType });

        // Send the response back to the client
        res.status(200).json(response);
    } catch (error) {
        console.error(`[Error] POST /chatgpt: ${error.message}`);
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
