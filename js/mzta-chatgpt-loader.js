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

import { authenticateSession } from '../services/chatgptSessionManager.js';

async function initializeChatGPTLoader() {
    try {
        const isAuthenticated = await authenticateSession();
        if (!isAuthenticated) {
            console.error("[ThunderAI] ChatGPT session is not authenticated. Please log in.");
            return;
        }
        console.log("[ThunderAI] ChatGPT session authenticated successfully.");
        // Add any additional initialization logic here
    } catch (error) {
        console.error("[ThunderAI] Error during ChatGPT session initialization:", error.message);
    }
}

initializeChatGPTLoader();