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
    constructor(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    /**
     * Authenticates the session if required.
     * @returns {Promise<boolean>} - Returns true if authentication is successful.
     */
    async authenticateSession() {
        try {
            const response = await fetch(`${this.apiUrl}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                logger.error(`Authentication failed: ${response.status} ${response.statusText}, Detail: ${errorDetail}`);
                return false;
            }

            logger.log('Authentication successful.');
            return true;
        } catch (error) {
            logger.error(`Error during authentication: ${error.message}`);
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
            const payload = {
                prompt,
                ...options,
            };

            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
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
