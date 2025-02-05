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

import { processChatSession } from '../services/chatgptSession.js';
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

        logger.log(`Received prompt: ${prompt}, actionType: ${actionType}`);

        // Process the chat session
        const response = await processChatSession({ prompt, actionType });

        // Send the response back to the client
        logger.log('Chat session processed successfully');
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error processing chat session: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
