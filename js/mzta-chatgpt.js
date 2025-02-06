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


// Some original methods derived from https://github.com/KudoAI/chatgpt.js/blob/7eb8463cd61143fa9e1d5a8ec3c14d3c1b286e54/chatgpt.js
// Using a full string to inject it in the ChatGPT page to avoid any security error

export const mzta_script = `
let force_go = false;
let do_force_completion = false;
let current_message = null;
let current_action = null;
let current_tabId = null;
let current_mailMessageId = null;
let selectionChangeTimeout = null;
let isDragging = false;

async function chatgpt_sendMsg(prompt, options = {}) {
    try {
        const response = await sendPrompt(prompt, options);
        console.log("[ThunderAI] Prompt sent successfully:", response);
        return response;
    } catch (error) {
        console.error("[ThunderAI] Error sending prompt:", error.message);
        throw error;
    }
}

async function chatgpt_isIdle() {
    if (!isSessionAuthenticated()) {
        console.error("Session is not authenticated. Please log in.");
        throw new Error("Session not authenticated.");
    }
    return true;
}

function chatgpt_getRegenerateButton() {
    for (const mainSVG of document.querySelectorAll('main svg.icon-md')) {
        if (mainSVG.querySelector('path[d^="M3.06957"]')) // regen icon found
            return mainSVG.parentNode.parentNode;
    }
}

function chatpgt_scrollToBottom () {
    try { 
        //document.querySelector('button[class*="cursor"][class*="bottom"]').click();
        document.querySelector('path[d^="M12 21C11.7348"]')?.parentNode?.parentNode?.click();
    }
    catch (err) { console.error('[ThunderAI] ', err); }
}

function customTextBtnClick(args) {
    const customText = document.getElementById('mzta-custom_textarea').value;
    args.customBtn.disabled = true;
    args.customBtn.classList.add('disabled');
    args.customLoading.style.display = 'inline-block';
    args.customLoading.style.display = 'none';
    doProceed(current_message,customText);
    args.customDiv.style.display = 'none';
}

function checkGPTModel(model) { //TODO
    if(model == '') return;
    doLog("checkGPTModel model: " + model);
  return new Promise((resolve, reject) => {
    // Set up an interval that shows the warning after 2 seconds
    const intervalId2 = setTimeout(() => {
        document.getElementById('mzta-model_warn').style.display = 'inline-block';
        document.getElementById('mzta-btn_model').style.display = 'inline';
    }, 2000);
    // Set up an interval that checks the value every 100 milliseconds
    const intervalId = setInterval(() => {
      // Get the '.text-token-text-secondary' element
     const elements = document.querySelectorAll('[id*=radix] span')

     for(element of elements){
      // Check if the element exists and its content is '4' or '4o'
      doLog("checkGPTModel model found in DOM: " + element.textContent);
      if ((element && element.textContent === model)||(force_go)) {
        doLog("The GPT Model is now " + model);
        clearInterval(intervalId);
        clearTimeout(intervalId2);
        document.getElementById('mzta-model_warn').style.display = 'none';
        document.getElementById('mzta-btn_model').style.display = 'none';
        resolve(model);
        break;
      } else if (!element) {
        console.error("[ThunderAI | ChatGPT Web] Model string element not found! [" + model + "]");
        clearInterval(intervalId);
        reject("Model string element not found: " + model);
      }
     }
    }, 200);
  });
}


function operation_done(){
    /* Removed Thunderbird-specific UI elements */
    chatpgt_scrollToBottom();
}

function checkLoggedIn(){
    return !window.location.href.startsWith('https://chatgpt.com/auth/');
}

function showCustomTextField(){
    document.getElementById('mzta-custom_text').style.display = 'block';
}

async function doProceed(message, customText = ''){
    let _gpt_model = mztaGPTModel;
    doLog("doProceed _gpt_model: " + JSON.stringify(_gpt_model));
    if(_gpt_model != ''){
        await checkGPTModel(_gpt_model);
    }
    let final_prompt = message.prompt;
    if(final_prompt.includes('{%additional_text%}')){
        final_prompt = final_prompt.replace('{%additional_text%}', customText || (mztaPhDefVal == '1'?'':'{%additional_text%}'));
    }else{
        if(customText != ''){
            final_prompt += ' '+customText;
        }
    }

    let send_result = await chatgpt_sendMsg(final_prompt,'click');
    switch(send_result){
        case -1:        // send button not found
            let curr_msg = document.getElementById('mzta-curr_msg');
            curr_msg.style.display = 'block';
            curr_msg.textContent = browser.i18n.getMessage("chatgpt_sendbutton_not_found_error");
            break;
        case -2:    // textarea not found
            let curr_model_warn = document.getElementById('mzta-model_warn');
            let message = browser.i18n.getMessage("chatgpt_textarea_not_found_error");
            let parts = message.split(/<a href="([^"]+)">([^<]+)<\\/a>/);
            curr_model_warn.textContent = parts[0];
            let link = document.createElement('a');
            link.href = parts[1];
            link.textContent = parts[2];
            curr_model_warn.appendChild(link);
            curr_model_warn.appendChild(document.createTextNode(parts[3]));
            curr_model_warn.style.display = 'inline-block';
            document.getElementById('mzta-curr_msg').textContent = "";
            document.getElementById('mzta-loading').style.display = 'none';
            let btn_retry = document.createElement('button');
            btn_retry.id="mzta-btn_retry";
            btn_retry.classList.add('mzta-btn');
            btn_retry.style.position = 'absolute';
            btn_retry.style.top = '5px';
            btn_retry.style.right = '5px';
            btn_retry.textContent = browser.i18n.getMessage("chatgpt_btn_retry");
            btn_retry.addEventListener('click', function() {
                doRetry();
            });
            curr_model_warn.insertAdjacentElement('afterend', btn_retry);
            break;
    }
    await chatgpt_isIdle();
    operation_done();
}

function doRetry(){
    doProceed(current_message);
}


function removeTagsAndReturnHTML(rootElement, removeTags, preserveTags) {
    const fragment = document.createDocumentFragment();

    function handleElement(element) {
        let child = element.firstChild;
        while (child) {
            const nextSibling = child.nextSibling;
            if (preserveTags.includes(child.nodeName.toLowerCase())) {
                fragment.appendChild(child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                handleElement(child);
            }
            child = nextSibling;
        }
    }

    removeTags.forEach(tag => {
        const elements = Array.from(rootElement.getElementsByTagName(tag));
        elements.forEach(element => {
            handleElement(element);
            element.parentNode.insertBefore(fragment.cloneNode(true), element);
            element.parentNode.removeChild(element);
        });
    });

    replaceNewlinesWithBr(rootElement);
    return rootElement.innerHTML;
}

function replaceNewlinesWithBr(node) {
    for (let child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const parts = child.textContent.split('\\\\n');
            if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                parts.forEach((part, index) => {
                    fragment.appendChild(document.createTextNode(part));
                    if (index < parts.length - 1) {
                        fragment.appendChild(document.createElement('br'));
                    }
                });
                child.parentNode.replaceChild(fragment, child);
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            replaceNewlinesWithBr(child);
        }
    }
}

function getSelectedHtml() {
    var selection = window.getSelection();
    
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var tempDiv = document.createElement("div");
        tempDiv.appendChild(range.cloneContents());
        return tempDiv.innerHTML.replace(/^<p>&quot;/, '<p>').replace(/&quot;<\\/p>$/, '</p>'); 
    }
    return "";
}

<empty>

<empty>

function selectContentOnMouseDown(event) {
    isDragging = false;
}

function selectContentOnMouseMove(event) {
    isDragging = true;
}

function selectContentOnMouseUp(event) {
    var excludedArea = document.querySelector('.mzta-header-fixed');

    if (excludedArea && excludedArea.contains(event.target)) {
        return;
    }

    if ((!isDragging)&&(!isSomethingSelected())) {
        selectContentOnClick(event);
    }
}

function selectContentOnClick(event) {
    if(current_action === '0'){
        return;
    }

    event.preventDefault();

    var clickedElement = event.target;

    var parentDiv = clickedElement.closest('div');

    if (parentDiv) {
        var range = document.createRange();
        range.selectNodeContents(parentDiv);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function doLog(msg){
    if(mztaDoDebug == 1){
        console.log("[ThunderAI | ChatGPT Web] " + msg);
    }
}

async function run() {
    try {
        const isAuthenticated = await authenticateSession();
        if (!isAuthenticated) {
            alert("You are not logged in. Please log in to ChatGPT.");
            return;
        }
        console.log("Session authenticated. Proceeding...");
        // Add your UI logic here
    } catch (error) {
        console.error("Error during session authentication:", error.message);
        alert("Failed to authenticate session. Please try again.");
    }
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.command) {
        case "chatgpt_send":
            current_action = message.action;
            current_message = message;
            current_tabId = message.tabId;
            current_mailMessageId = message.mailMessageId;
            run();
            break;
        case "chatgpt_alive":
            sendResponse({isAlive: true});
            break;
    }
});

let checkTab = setInterval(() => {
    let customDiv = document.getElementById('mzta-custom_text');
    if(customDiv){
        clearInterval(checkTab);
    }else{
        run();
    }
}, 1000);

`


import { authenticateSession, sendPrompt, isSessionAuthenticated } from '../services/chatgptSessionManager.js';