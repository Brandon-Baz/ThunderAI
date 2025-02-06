/*
 *  ThunderAI [https://micz.it/thunderbird-addon-thunderai/]
 *  Copyright (C) 2024 - 2025  Mic (m@micz.it)

 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { taLogger } from '../js/mzta-logger.js';

const logger = new taLogger('chatgptSessionManager', true);

let sessionAuthenticated = false;

/**
 * Authenticate the ChatGPT session.
 * This function ensures the session is valid and refreshes or re-authenticates if needed.
 * @returns {Promise<boolean>} - Returns true if the session is authenticated, false otherwise.
 */
export async function authenticateSession() {
    try {
        logger.log('Authenticating ChatGPT session...');
        const response = await fetch('https://chatgpt.com/api/auth/session', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const sessionData = await response.json();
            sessionAuthenticated = sessionData?.authenticated || false;
            logger.log(`Session authenticated: ${sessionAuthenticated}`);
            return sessionAuthenticated;
        } else {
            logger.error(`Failed to authenticate session. Status: ${response.status}`);
            sessionAuthenticated = false;
            return false;
        }
    } catch (error) {
        logger.error(`Error during session authentication: ${error.message}`);
        sessionAuthenticated = false;
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
    if (!sessionAuthenticated) {
        logger.log('Session not authenticated. Attempting to authenticate...');
        const authenticated = await authenticateSession();
        if (!authenticated) {
            throw new Error('Unable to authenticate ChatGPT session.');
        }
    }

    try {
        logger.log('Sending prompt to ChatGPT...');
        const response = await fetch('https://chatgpt.com/api/conversation', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
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

/**
 * Check if the session is currently authenticated.
 * @returns {boolean} - True if the session is authenticated, false otherwise.
 */
export function isSessionAuthenticated() {
    return sessionAuthenticated;
}