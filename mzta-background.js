import { mzta_script } from './js/mzta-chatgpt.js';
import { prefs_default } from './options/mzta-options-default.js';

var createdWindowID = null;

browser.composeScripts.register({
    js: [{file: "/js/mzta-compose-script.js"}]
});

// Register the message display script for all newly opened message tabs.
messenger.messageDisplayScripts.register({
    js: [{ file: "js/mzta-compose-script.js" }],
});

// Inject script and CSS in all already open message tabs.
let openTabs = await messenger.tabs.query();
let messageTabs = openTabs.filter(
    tab => ["mail", "messageDisplay"].includes(tab.type)
);
for (let messageTab of messageTabs) {
    browser.tabs.executeScript(messageTab.id, {
        file: "js/mzta-compose-script.js"
    })
}


messenger.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check what type of message we have received and invoke the appropriate
    // handler function.
    if (message && message.hasOwnProperty("command")){
        switch (message.command) {
            case 'chatgpt_open':
                    openChatGPT(message.prompt,message.action,message.tabId);
                    return true;
            case 'chatgpt_close':
                    browser.windows.remove(createdWindowID).then(() => {
                        console.log("ChatGPT window closed successfully.");
                        return true;
                    }).catch((error) => {
                        console.error("Error closing ChatGPT window:", error);
                        return false;
                    });
                    break;
            case 'chatgpt_replaceSelectedText':
                    //console.log('chatgpt_replaceSelectedText: [' + message.tabId +'] ' + message.text)
                    browser.tabs.sendMessage(message.tabId, { command: "replaceSelectedText", text: message.text });
                    return true;
            case 'chatgpt_replyMessage':
                //console.log('message.text: ' + message.text);
                const chunks = message.text.split(/\n{2,}/);
                const paragraphs = chunks.map((t) => {
                    const p = document.createElement("p");
                    p.innerText = t;
                    return p;
                });
                const paragraphsHtmlString = paragraphs.map(p => p.outerHTML).join("");
                //console.log('paragraphsHtmlString: ' + paragraphsHtmlString);
                browser.messageDisplay.getDisplayedMessage(message.tabId).then((mailMessage) => {
                    browser.compose.beginReply(mailMessage.id, "replyToAll", {
                        type: "reply",
                        body:  paragraphsHtmlString,
                        isPlainText: false,
                    })
                });
                break;
            default:
                break;
        }
    }
    // Return false if the message was not handled by this listener.
    return false;
});


async function openChatGPT(promptText,action,curr_tabId){
    let prefs = await browser.storage.sync.get(prefs_default);
    return browser.windows.create({
        url: "https://chat.openai.com",
        type: "popup",
        width: prefs.chatgpt_win_width,
        height: prefs.chatgpt_win_height
    }).then((newWindow) => {
        console.log("Script started...");
        createdWindowID = newWindow.id;
        //console.log(promptText);
        const tabId = newWindow.tabs[0].id;
        browser.tabs.executeScript(tabId,{code: mzta_script})
            .then(async () => {
                console.log("Script injected successfully");
                browser.tabs.sendMessage(tabId, {command: "chatgpt_send", prompt: promptText, action: action, tabId: curr_tabId});
                }).catch(err => {
                    console.error("Error injecting the script: ", err);
                });
            });
}
