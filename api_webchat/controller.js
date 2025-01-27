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

import { placeholdersUtils } from '../js/mzta-placeholders.js';

// Get the LLM to be used
const urlParams = new URLSearchParams(window.location.search);
const llm = urlParams.get('llm');
const call_id = urlParams.get('call_id');
const ph_def_val = urlParams.get('ph_def_val');

// Data received from the user
let promptData = null;

const messageInput = document.querySelector('message-input');
const messagesArea = document.querySelector('messages-area');

//console.log(">>>>>>>>>> controller.js DOMContentLoaded");

// console.log(">>>>>>>>>>> llm: " + llm);
// console.log(">>>>>>>>>>> call_id: " + call_id);

// The controller wires up all the components and workers together,
// managing the dependencies. A kind of "DI" class.
let worker = null;

switch (llm) {
    case "chatgpt_api":
        worker = new Worker('../js/workers/model-worker-openai.js', { type: 'module' });
        break;
    case "google_gemini_api":
        worker = new Worker('../js/workers/model-worker-google_gemini.js', { type: 'module' });
        break;
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
        let prefs_api = await browser.storage.sync.get({chatgpt_api_key: '', chatgpt_model: '', chatgpt_developer_messages:'', do_debug: false});
        let i18nStrings = {};
        i18nStrings["chatgpt_api_request_failed"] = browser.i18n.getMessage('chatgpt_api_request_failed');
        i18nStrings["error_connection_interrupted"] = browser.i18n.getMessage('error_connection_interrupted');
        messageInput.setModel(prefs_api.chatgpt_model);
        messagesArea.setLLMName("ChatGPT");
        worker.postMessage({ type: 'init', chatgpt_api_key: prefs_api.chatgpt_api_key, chatgpt_model: prefs_api.chatgpt_model, chatgpt_developer_messages: prefs_api.chatgpt_developer_messages, do_debug: prefs_api.do_debug, i18nStrings: i18nStrings});
        messagesArea.appendUserMessage(browser.i18n.getMessage("chagpt_api_connecting") + " " +browser.i18n.getMessage("AndModel") + " \"" + prefs_api.chatgpt_model + "\"...", "info");
        browser.runtime.sendMessage({command: "openai_api_ready_" + call_id, window_id: (await browser.windows.getCurrent()).id});
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

//let prefs_ph = await browser.storage.sync.get({placeholders_use_default_value: false});

// Event listeners for worker messages
worker.onmessage = function(event) {
    const { type, payload } = event.data;
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
            messagesArea.appendBotMessage(payload,'error');
            messageInput.enableInput();
            break;
        default:
            console.error('[ThunderAI] Unknown event type from API worker:', type);
    }
};

// handling commands from the backgound page
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case "api_send":
            //send the received prompt to the llm api
            if(message.do_custom_text=="1") {
                let userInput = prompt(browser.i18n.getMessage("chatgpt_win_custom_text"));
                if(userInput !== null) {
                    if(!placeholdersUtils.hasPlaceholder(message.prompt, 'additional_text')){
                        // no additional_text placeholder, do as usual
                        message.prompt += " " + userInput;
                    }else{
                        // we have the additional_text placeholder, do the magic!
                        let finalSubs = {};
                        finalSubs["additional_text"] = userInput;
                        message.prompt = placeholdersUtils.replacePlaceholders(message.prompt, finalSubs, ph_def_val==='1')
                    }
                }
            }
            promptData = message;
            messageInput._setMessageInputValue(message.prompt);
            messageInput._handleNewChatMessage();
            break;
        case "api_error":
            messagesArea.appendBotMessage(message.error,'error');
            messageInput.enableInput();
            break;
    }
});