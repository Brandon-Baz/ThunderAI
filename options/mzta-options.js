import { prefs_default } from './mzta-options-default.js';

function saveOptions(e) {
  e.preventDefault();
  let options = {};
  let element = e.target;

    switch (element.type) {
      case 'checkbox':
        options[element.id] = element.checked;
        break;
      case 'number':
        options[element.id] = element.valueAsNumber;
        break;
      case 'text':
        options[element.id] = element.value.trim();
        break;
      default:
        if (element.tagName === 'SELECT') {
          options[element.id] = element.value;
        }else{
          console.log('Unhandled input type:', element.type);
        }
    }

  browser.storage.sync.set(options);
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelectorAll(".option-input").forEach(element => {
      switch (element.type) {
        case 'checkbox':
          element.checked = result[element.id] || false;
          break;
        case 'number':
          let default_value = 0;
          if(element.id == 'chatgpt_win_height') default_value = prefs_default.chatgpt_win_height;
          if(element.id == 'chatgpt_win_width') default_value = prefs_default.chatgpt_win_width;
          element.value = result[element.id] || default_value;
          break;
        case 'text':
          element.value = result[element.id] || '';
          break;
        default:
        if (element.tagName === 'SELECT') {
          element.value = result[element.id] || '';
          if (element.value === '') {
            element.selectedIndex = -1;
          }
        }else{
          console.log('Unhandled input type:', element.type);
        }
      }
    });
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(null);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  i18n.updateDocument();
  document.querySelectorAll(".option-input").forEach(element => {
    element.addEventListener("change", saveOptions);
  });
}, { once: true });
