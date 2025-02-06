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

/**
 * Handles sending a prompt to the backend API and updating the UI with the response.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('promptForm');
    const promptInput = document.getElementById('promptInput');
    const responseDiv = document.getElementById('response');

    /**
     * Sends a POST request to the backend API with the user's prompt.
     * @param {string} prompt - The user's input prompt.
     * @returns {Promise<Object>} - The response from the backend API.
     */
    async function sendPromptToAPI(prompt) {
        try {
            const response = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, actionType: 'default' }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('[ThunderAI] Error sending prompt to API:', error);
            throw error;
        }
    }

    /**
     * Handles the form submission event.
     * @param {Event} event - The form submission event.
     */
    async function handleFormSubmit(event) {
        event.preventDefault();

        const prompt = promptInput.value.trim();
        if (!prompt) {
            responseDiv.textContent = 'Please enter a prompt.';
            return;
        }

        responseDiv.textContent = 'Processing...';

        try {
            const data = await sendPromptToAPI(prompt);
            responseDiv.textContent = data.response || 'No response received.';
        } catch (error) {
            responseDiv.textContent = `Error: ${error.message}`;
        }
    }

    // Attach the form submission handler.
    form.addEventListener('submit', handleFormSubmit);
});