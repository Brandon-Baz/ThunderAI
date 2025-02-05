
import { taLogger } from '../js/mzta-logger.js';
import jwt from 'jsonwebtoken';

const logger = new taLogger('chatgptSessionManager', true);

let sessionToken = null;

/**
 * Authenticate the ChatGPT session.
 * This function ensures the session is valid and refreshes or re-authenticates if needed.
 * @returns {Promise<boolean>} - Returns true if the session is authenticated, false otherwise.
 */
export async function authenticateSession() {
    try {
        logger.log('Authenticating ChatGPT session...');
        const response = await fetch(process.env.CHATGPT_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: process.env.CHATGPT_API_KEY,
            }),
        });

        if (response.ok) {
            const { token } = await response.json();
            sessionToken = token;
            logger.log('Session authenticated successfully');
            return true;
        } else {
            logger.error(`Failed to authenticate session. Status: ${response.status}`);
            sessionToken = null;
            return false;
        }
    } catch (error) {
        logger.error(`Error during session authentication: ${error.message}`);
        sessionToken = null;
        return false;
    }
}

/**
 * Verify if the current session token is valid.
 * @returns {boolean} - Returns true if the token is valid, false otherwise.
 */
export function isSessionAuthenticated() {
    if (!sessionToken) return false;
    try {
        jwt.verify(sessionToken, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        logger.error(`Invalid session token: ${error.message}`);
        return false;
    }
}

/**
 * Send a prompt to ChatGPT.
 * This function ensures the session is authenticated before sending the prompt.
 * @param {string} prompt - The prompt to send to ChatGPT.
 * @param {object} options - Additional options for the request.
 * @returns {Promise<object>} - The response from ChatGPT.
 */
export async function sendPrompt(prompt, options = {}) {
    if (!isSessionAuthenticated()) {
        logger.log('Session not authenticated. Attempting to authenticate...');
        const authenticated = await authenticateSession();
        if (!authenticated) {
            throw new Error('Unable to authenticate ChatGPT session.');
        }
    }

    try {
        logger.log('Sending prompt to ChatGPT...');
        const response = await fetch(process.env.CHATGPT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({
                prompt,
                ...options,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            logger.log('Prompt sent successfully.');
            return responseData;
        } else {
            logger.error(`Failed to send prompt. Status: ${response.status}`);
            throw new Error(`Failed to send prompt. Status: ${response.status}`);
        }
    } catch (error) {
        logger.error(`Error while sending prompt: ${error.message}`);
        throw error;
    }
}
