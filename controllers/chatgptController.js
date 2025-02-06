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

import { sendPrompt, isSessionAuthenticated } from '../services/chatgptSessionManager.js';
import { taLogger } from '../js/mzta-logger.js';

const logger = new taLogger('chatgptController', true);

/**
 * Handles the processing of a chat prompt via POST request.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const sendPrompt = async (req, res) => {
    try {
        const { prompt, actionType } = req.body;

        // Validate required fields
        if (!prompt || !actionType) {
            logger.warn('Missing required fields: prompt or actionType');
            return res.status(400).json({ error: 'Missing required fields: prompt or actionType' });
        }

        // Check if session is authenticated
        if (!isSessionAuthenticated()) {
            logger.error('ChatGPT session is not authenticated.');
            return res.status(401).json({ error: 'Session not authenticated. Please log in to ChatGPT.' });
        }

        logger.log(`Received prompt: ${prompt}, actionType: ${actionType}`);

        // Send the prompt to ChatGPT
        const response = await sendPrompt(prompt, { actionType });

        // Send the response back to the client
        logger.log('Prompt sent successfully');
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error sending prompt: ${error.message}`);
        return res.status(500).json({ error: `Failed to process the request: ${error.message}` });
    }
};