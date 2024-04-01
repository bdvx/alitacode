// Copyright 2023 EPAM Systems
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const WorkspaceService = require("./workspace.service");
const Request = require("../http/request");
const vscode = require("vscode");
const llmServierProvider = require("./providers/index");

module.exports = class AlitaService {
  constructor() {
    this.request = (url, options) => new Request(url, options);
    this.workspaceService = new WorkspaceService();
    this.currentProvider = this.workspaceService.getWorkspaceConfig().LLMProvider
    this.serviceProvider = undefined;
    this.init_done = 0;
  }

  checkLLMConfig() {
    const newProvier = this.workspaceService.getWorkspaceConfig().LLMProvider
    try {
      if (newProvier !== this.currentProvider && newProvier !== undefined) {
        this.serviceProvider = new llmServierProvider[newProvier]();
        this.currentProvider = newProvier;
        this.init_done = 0;
      } else if (newProvier === undefined) {
        this.currentProvider = undefined;
        this.serviceProvider = undefined;
      } else if (this.serviceProvider === undefined) {
        this.serviceProvider = new llmServierProvider[newProvier]();
        this.currentProvider = newProvier;
        this.init_done = 0;
      }
    } catch (ex) {
      console.log(ex)
      this.serviceProvider = undefined;
    }
    console.log(this.serviceProvider)
  }

  async invokeMethod(functionName, fnDesc, params) {
    try {
      this.checkLLMConfig()
      if (this.serviceProvider[functionName]) {
        const result = await this.serviceProvider[functionName](params);
        return result
      } else {
        return `${fnDesc} not supported by this LLM Provider`
      }
    } catch (ex) {
      await vscode.window.showErrorMessage(`Alita is not able to connect ${ex.stack}`);
      return "You need to configure LLM Provider first"
    }
  }

  async askAlita({ prompt, template, prompt_template = undefined }) {
    try {
      this.checkLLMConfig()
      return await this.serviceProvider.predict(template, prompt, prompt_template)
    } catch (ex) {
      await vscode.window.showErrorMessage(`Alita is not able to connect ${ex.stack}`);
      return "You need to configure LLM Provider first"
    }
  }

  async getPrompts() {
    return await this.invokeMethod("getPrompts", "List prompts")
  }

  async getDatasources() {
    return await this.invokeMethod("getDatasources", "List datasources")
  }

  async chat(params) {
    return await this.invokeMethod("chat", "Chat", params)
  }

  async askOptions({ embedding, prompt, top_k, cutoff, type = "append" }) {
    let result = await this.serviceProvider.similarity(embedding, prompt.trim(), top_k, cutoff)
    return {
      content: result.trim(),
      type: type
    }
  }
};
