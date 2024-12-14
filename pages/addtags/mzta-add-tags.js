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

document.addEventListener('DOMContentLoaded', async () => {

    let specialPrompts = await getSpecialPrompts();
    let addtags_prompt = specialPrompts.find(prompt => prompt.id === 'prompt_add_tags');
    addtags_prompt.text = browser.i18n.getMessage(addtags_prompt.text);

    document.getElementById('addtags_prompt_text').value = addtags_prompt.text;

    i18n.updateDocument();
});