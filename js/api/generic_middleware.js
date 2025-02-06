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

import { taLogger } from '../mzta-logger.js';

export class GenericMiddleware {

  host = '';
  model = '';
  apiKey = '';
  use_v1 = true;
  stream = false;
  logger = null;

  constructor(host, model, apiKey = '', stream = false, use_v1 = true, do_debug = false) {
    this.host = host.trim().replace(/\/+$/, "");
    this.model = model;
    this.stream = stream;
    this.apiKey = apiKey;
    this.use_v1 = use_v1;
    this.logger = new taLogger('GenericMiddleware', do_debug);
  }

  fetchModels = async () => {
    const curr_headers = {
      "Content-Type": "application/json",
    };
    if(this.apiKey !== '') curr_headers["Authorization"] = "Bearer "+ this.apiKey;

    try {
      const response = await fetch(this.host + (this.use_v1 ? "/v1" : "") + "/models", {
          method: "GET",
          headers: curr_headers,
      });

      if (!response.ok) {
          const errorDetail = await response.text();
          let err_msg = "[ThunderAI] Generic Middleware request failed: " + response.status + " " + response.statusText + ", Detail: " + errorDetail;
          this.logger.error(err_msg);
          let output = {};
          output.ok = false;
          output.error = errorDetail;
          return output;
      }

      let output = {};
      output.ok = true;
      let output_response = await response.json();
      output.response = output_response.data;

      return output;
    } catch (error) {
      this.logger.error("[ThunderAI] Generic Middleware request failed: " + error);
      let output = {};
      output.is_exception = true;
      output.ok = false;
      output.error = "Generic Middleware request failed: " + error;
      return output;
    }
  }

  fetchResponse = async (messages, maxTokens = 0) => {
    const curr_headers = {
      "Content-Type": "application/json",
    };
    if(this.apiKey !== '') curr_headers["Authorization"] = "Bearer "+ this.apiKey;

    try {
      const response = await fetch(this.host + (this.use_v1 ? "/v1" : "") + "/chat/completions", {
          method: "POST",
          headers: curr_headers,
          body: JSON.stringify({ 
              model: this.model, 
              messages: messages,
              stream: this.stream,
              ...(maxTokens > 0 ? { 'max_tokens': parseInt(maxTokens) } : {})
          }),
      });

      if (!response.ok) {
          const errorDetail = await response.text();
          let err_msg = "[ThunderAI] Generic Middleware request failed: " + response.status + " " + response.statusText + ", Detail: " + errorDetail;
          this.logger.error(err_msg);
          let output = {};
          output.ok = false;
          output.error = errorDetail;
          return output;
      }

      return response;
    } catch (error) {
      this.logger.error("[ThunderAI] Generic Middleware request failed: " + error);
      let output = {};
      output.is_exception = true;
      output.ok = false;
      output.error = "Generic Middleware request failed: " + error;
      return output;
    }
  }
}
