/*
 *  ThunderAI [https://micz.it/thunderbird-addon-thunderai/]
 *  Copyright (C) 2024  Mic (m@micz.it)

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

import { getSpecialPrompts, setSpecialPrompts } from "../../js/mzta-prompts.js";
import { getPlaceholders } from "../../js/mzta-placeholders.js";
import { textareaAutocomplete } from "../../js/mzta-placeholders-autocomplete.js";
import { addTags_getExclusionList, addTags_setExclusionList } from "../../js/mzta-addatags-exclusion-list.js";

let autocompleteSuggestions = [];

document.addEventListener('DOMContentLoaded', async () => {

    i18n.updateDocument();

    let addtags_textarea = document.getElementById('addtags_prompt_text');
    let addtags_save_btn = document.getElementById('btn_save_prompt');
    let addtags_reset_btn = document.getElementById('btn_reset_prompt');

    let specialPrompts = await getSpecialPrompts();
    let addtags_prompt = specialPrompts.find(prompt => prompt.id === 'prompt_add_tags');

    addtags_textarea.addEventListener('input', (event) => {
        addtags_reset_btn.disabled = (event.target.value === browser.i18n.getMessage('prompt_add_tags_full_text'));
        addtags_save_btn.disabled = (event.target.value === addtags_prompt.text);
        if(addtags_save_btn.disabled){
            document.getElementById('addtags_prompt_unsaved').classList.add('hidden');
        } else {
            document.getElementById('addtags_prompt_unsaved').classList.remove('hidden');
        }
    });

    addtags_reset_btn.addEventListener('click', () => {
        addtags_textarea.value = browser.i18n.getMessage('prompt_add_tags_full_text');
        addtags_reset_btn.disabled = true;
        let event = new Event('input', { bubbles: true, cancelable: true });
        addtags_textarea.dispatchEvent(event);
    });

    addtags_save_btn.addEventListener('click', () => {
        specialPrompts.find(prompt => prompt.id === 'prompt_add_tags').text = addtags_textarea.value;
        setSpecialPrompts(specialPrompts);
        addtags_save_btn.disabled = true;
        document.getElementById('addtags_prompt_unsaved').classList.add('hidden');
        browser.runtime.sendMessage({command: "reload_menus"});
    });

    if(addtags_prompt.text === 'prompt_add_tags_full_text'){
        addtags_prompt.text = browser.i18n.getMessage(addtags_prompt.text);
    }
    addtags_textarea.value = addtags_prompt.text;
    addtags_reset_btn.disabled = (addtags_textarea.value === browser.i18n.getMessage('prompt_add_tags_full_text'));

    let prefs_maxt = await browser.storage.sync.get({add_tags_maxnum: 3});
    if(prefs_maxt.add_tags_maxnum > 0){
        let el_tag_limit = document.getElementById('addtags_info_limit_num');
        el_tag_limit.textContent = browser.i18n.getMessage("addtags_info_limit_num") + " \"" + browser.i18n.getMessage("prompt_add_tags_maxnum") + " " + prefs_maxt.add_tags_maxnum +"\".";
        el_tag_limit.style.display = 'block';
    }

    autocompleteSuggestions = (await getPlaceholders(true)).filter(p => !(p.id === 'selected_text' || p.id === 'additional_text')).map(p => ({command: '{%'+p.id+'%}', type: p.type}));
    textareaAutocomplete(addtags_textarea, autocompleteSuggestions, 1);    // type_value = 1, only when reading an email

    let excl_list_textarea = document.getElementById('addtags_excl_list');
    let excl_list_save_btn = document.getElementById('btn_save_excl_list');

    let excl_list_value = await addTags_getExclusionList();
    let excl_list_string = excl_list_value.join('\n');

    excl_list_textarea.value = excl_list_string;

    excl_list_textarea.addEventListener('input', (event) => {
        excl_list_save_btn.disabled = (event.target.value === excl_list_string);
        if(excl_list_save_btn.disabled){
            document.getElementById('excl_list_unsaved').classList.add('hidden');
        } else {
            document.getElementById('excl_list_unsaved').classList.remove('hidden');
        }
    });

    excl_list_save_btn.addEventListener('click', () => {
        let excl_array_new = excl_list_textarea.value.split(/[\n,]+/);
        excl_array_new = Array.from(new Set(excl_array_new.map(item => item.trim().toLowerCase()))).sort();
        addTags_setExclusionList(excl_array_new);
        excl_list_save_btn.disabled = true;
        excl_list_textarea.value = excl_array_new.join('\n');
        document.getElementById('excl_list_unsaved').classList.add('hidden');
    });

});