/*
 *  ThunderAI [https://micz.it/thunderbird-addon-thunderai/]
 *  Copyright (C) 2024 - 2025  Mic (m@micz.it)
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fetch from 'node-fetch';
import { taLogger } from '../js/mzta-logger.js';

const logger = new taLogger('chatgptSession', true);

/**
 * Handles ChatGPT session management and communication.
 */
export class ChatGPTSession {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    /**
     * Authenticates the session by querying the ChatGPT web API.
     * @returns {Promise<boolean>} - Returns true if the session is authenticated.
     */
    async authenticateSession() {
        try {
            logger.log('Authenticating ChatGPT session...');
            const response = await fetch(`${this.apiBaseUrl}/api/auth/session`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                logger.error(`Authentication failed: ${response.status} ${response.statusText}, Detail: ${errorDetail}`);
                return false;
            }

            const sessionData = await response.json();
            const isAuthenticated = sessionData?.authenticated || false;

            if (isAuthenticated) {
                logger.log('Session authenticated successfully.');
            } else {
                logger.warn('Session not authenticated.');
            }

            return isAuthenticated;
        } catch (error) {
            logger.error(`Error during session authentication: ${error.message}`);
            return false;
        }
    }

    /**
     * Sends a prompt to ChatGPT and retrieves the response.
     * @param {string} prompt - The prompt to send.
     * @param {Object} options - Additional options for the request.
     * @returns {Promise<Object>} - The AI response.
     */
    async sendPrompt(prompt, options = {}) {
        try {
            logger.log('Sending prompt to ChatGPT...');
            const payload = {
                prompt,
                ...options,
            };

            const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                logger.error(`Failed to send prompt: ${response.status} ${response.statusText}, Detail: ${errorDetail}`);
                throw new Error(`Failed to send prompt: ${response.statusText}`);
            }

            const data = await response.json();
            logger.log('Prompt sent successfully.');
            return data;
        } catch (error) {
            logger.error(`Error sending prompt: ${error.message}`);
            throw error;
        }
    }
}

export default ChatGPTSession;