
import { sendPrompt, isSessionAuthenticated } from '../services/chatgptSessionManager.js';
import { logError, logInfo, ValidationError } from '../utils/errors.js';

/**
 * Handles the processing of a chat prompt via POST request.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const handleChatRequest = async ({ prompt, actionType }) => {
    try {
        // Validate required fields
        if (!prompt || !actionType) {
            throw new ValidationError('Missing required fields: prompt or actionType');
        }

        // Check if session is authenticated
        if (!isSessionAuthenticated()) {
            throw new Error('ChatGPT session is not authenticated.');
        }

        logInfo(`Received prompt: ${prompt}, actionType: ${actionType}`, 'handleChatRequest');

        // Send the prompt to ChatGPT
        const response = await sendPrompt(prompt, { actionType });

        logInfo('Prompt sent successfully', 'handleChatRequest');
        return response;
    } catch (error) {
        logError(error, 'handleChatRequest');
        throw error;
    }
};
