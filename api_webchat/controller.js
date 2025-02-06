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
 * 
 * 
 *  This file contains a modified version of the code from the project at https://github.com/boxabirds/chatgpt-frontend-nobuild
 *  The original code has been released under the Apache License, Version 2.0.
 */

// Import session manager for authentication
import { authenticateSession, isSessionAuthenticated, sendPrompt } from '../services/chatgptSessionManager.js';

// Get the LLM to be used
const urlParams = new URLSearchParams(window.location.search);
const llm = urlParams.get('llm');
const ph_def_val = urlParams.get('ph_def_val');

// Data received from the user
let promptData = null;

const messageInput = document.querySelector('message-input');
const messagesArea = document.querySelector('messages-area');

// Logging for debugging
console.log("Controller initialized with LLM:", llm);

(async () => {
    const isAuthenticated = await authenticateSession();
    if (!isAuthenticated) {
        console.error("Session not authenticated. Please log in.");
        throw new Error("Session not authenticated.");
    }
    console.log("Session authenticated successfully.");
})();

// The controller wires up all the components and workers together,
// managing the dependencies. A kind of "DI" class.
let worker = null;

switch (llm) {
    case "chatgpt_api": {
        const isAuthenticated = await isSessionAuthenticated();
        if (!isAuthenticated) {
            console.error("Session not authenticated. Please log in.");
            throw new Error("Session not authenticated.");
        }

        const response = await sendPrompt("Initialize ChatGPT API", { model: "chatgpt" });
        if (response.error) {
            console.error("Error initializing ChatGPT API:", response.error);
            throw new Error(response.error);
        }

        messagesArea.setLLMName("ChatGPT");
        messagesArea.appendUserMessage("ChatGPT API initialized successfully.", "info");
        break;
    }
    case "google_gemini_api": {
        const isAuthenticated = await isSessionAuthenticated();
        if (!isAuthenticated) {
            console.error("Session not authenticated. Please log in.");
            throw new Error("Session not authenticated.");
        }

        const response = await sendPrompt("Initialize Google Gemini API", { model: "gemini" });
        if (response.error) {
            console.error("Error initializing Google Gemini API:", response.error);
            throw new Error(response.error);
        }

        messagesArea.setLLMName("Google Gemini");
        messagesArea.appendUserMessage("Google Gemini API initialized successfully.", "info");
        break;
    }
    case "ollama_api":
        worker = new Worker('../js/workers/model-worker-ollama.js', { type: 'module' });
        break;
    case "openai_comp_api":
        worker = new Worker('../js/workers/model-worker-openai_comp.js', { type: 'module' });
        break;
}

messagesArea.init(worker);

// Initialize the messageInput component and pass the worker to it
messageInput.init(worker);
messageInput.setMessagesArea(messagesArea);

switch (llm) {
    case "chatgpt_api": {
        const isAuthenticated = await isSessionAuthenticated();
        if (!isAuthenticated) {
            console.error("Session not authenticated. Please log in.");
            throw new Error("Session not authenticated.");
        }

        const response = await sendPrompt("Initialize ChatGPT API", { model: "chatgpt" });
        if (response.error) {
            console.error("Error initializing ChatGPT API:", response.error);
            throw new Error(response.error);
        }

        messagesArea.setLLMName("ChatGPT");
        messagesArea.appendUserMessage("ChatGPT API initialized successfully.", "info");
        break;
    }
    case "google_gemini_api": {
        let prefs_api = await browser.storage.sync.get({google_gemini_api_key: '', google_gemini_model: '', google_gemini_system_instruction: '', do_debug: false});
        let i18nStrings = {};
        i18nStrings["google_gemini_api_request_failed"] = browser.i18n.getMessage('google_gemini_api_request_failed');
        i18nStrings["error_connection_interrupted"] = browser.i18n.getMessage('error_connection_interrupted');
        messageInput.setModel(prefs_api.google_gemini_model);
        messagesArea.setLLMName("Google Gemini");
        worker.postMessage({ type: 'init', google_gemini_api_key: prefs_api.google_gemini_api_key, google_gemini_model: prefs_api.google_gemini_model, google_gemini_system_instruction: prefs_api.google_gemini_system_instruction, do_debug: prefs_api.do_debug, i18nStrings: i18nStrings});
        messagesArea.appendUserMessage(browser.i18n.getMessage("google_gemini_api_connecting") + " " +browser.i18n.getMessage("AndModel") + " \"" + prefs_api.google_gemini_model + "\"...", "info");
        browser.runtime.sendMessage({command: "google_gemini_api_ready_" + call_id, window_id: (await browser.windows.getCurrent()).id});
        break;
    }
    case "ollama_api": {
        let prefs_api = await browser.storage.sync.get({ollama_host: '', ollama_model: '', do_debug: false});
        let i18nStrings = {};
        i18nStrings["ollama_api_request_failed"] = browser.i18n.getMessage('ollama_api_request_failed');
        i18nStrings["error_connection_interrupted"] = browser.i18n.getMessage('error_connection_interrupted');
        messageInput.setModel(prefs_api.ollama_model);
        messagesArea.setLLMName("Ollama Local");
        worker.postMessage({ type: 'init', ollama_host: prefs_api.ollama_host, ollama_model: prefs_api.ollama_model, do_debug: prefs_api.do_debug, i18nStrings: i18nStrings});
        browser.runtime.sendMessage({command: "ollama_api_ready_" + call_id, window_id: (await browser.windows.getCurrent()).id});
        messagesArea.appendUserMessage(browser.i18n.getMessage("ollama_api_connecting") + " \"" + prefs_api.ollama_host + "\" " +browser.i18n.getMessage("AndModel") + " \"" + prefs_api.ollama_model + "\"...", "info");
        break;
    }
    case "openai_comp_api": {
        let prefs_api = await browser.storage.sync.get({openai_comp_host: '', openai_comp_model: '', openai_comp_api_key: '', openai_comp_use_v1: true, openai_comp_chat_name: '', do_debug: false});
        let i18nStrings = {};
        i18nStrings["OpenAIComp_api_request_failed"] = browser.i18n.getMessage('OpenAIComp_api_request_failed');
        i18nStrings["error_connection_interrupted"] = browser.i18n.getMessage('error_connection_interrupted');
        messageInput.setModel(prefs_api.openai_comp_model);
        messagesArea.setLLMName(prefs_api.openai_comp_chat_name);
        worker.postMessage({ type: 'init', openai_comp_host: prefs_api.openai_comp_host, openai_comp_model: prefs_api.openai_comp_model, openai_comp_api_key: prefs_api.openai_comp_api_key, openai_comp_use_v1: prefs_api.openai_comp_use_v1, do_debug: prefs_api.do_debug, i18nStrings: i18nStrings});
        messagesArea.appendUserMessage(browser.i18n.getMessage("OpenAIComp_api_connecting") + " \"" + prefs_api.openai_comp_host + "\" " +browser.i18n.getMessage("AndModel") + " \"" + prefs_api.openai_comp_model + "\"...", "info");
        browser.runtime.sendMessage({command: "openai_comp_api_ready_" + call_id, window_id: (await browser.windows.getCurrent()).id});
        break;
    }
}

// Event listeners for worker messages
worker.onmessage = async function(event) {
    const { type, payload } = event.data;
    try {
        switch (type) {
            case 'messageSent':
                messageInput.handleMessageSent();
                break;
            case 'newToken':
                messagesArea.handleNewToken(payload.token);
                messageInput.setStatusMessage('Receiving data...');
                break;
            case 'tokensDone':
                messagesArea.handleTokensDone(promptData);
                messageInput.enableInput();
                break;
            case 'error':
                messagesArea.appendBotMessage(payload, 'error');
                messageInput.enableInput();
                break;
            default:
                console.error('[ThunderAI] Unknown event type from API worker:', type);
        }
    } catch (error) {
        console.error("Error handling worker message:", error.message);
    }
};

// Middleware service logic for handling messages
window.addEventListener("message", async (event) => {
    const { command, prompt, options } = event.data;

    switch (command) {
        case "api_send":
            try {
                const response = await sendPrompt(prompt, options);
                console.log("Prompt sent successfully:", response);
                messagesArea.appendBotMessage(response, 'success');
            } catch (error) {
                console.error("Error sending prompt:", error.message);
                messagesArea.appendBotMessage(error.message, 'error');
            }
            break;

        case "api_error":
            console.error("API Error:", event.data.error);
            messagesArea.appendBotMessage(event.data.error, 'error');
            break;

        default:
            console.warn("Unknown command received:", command);
    }
});