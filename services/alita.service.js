const WorkspaceService = require("./workspace.service");
const Request = require("../http/request");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const vscode = require("vscode");
const llmServierProvider = require("./providers/index");

module.exports = class AlitaService {
  constructor() {
    this.request = (url, options) => new Request(url, options);
    this.workspaceService = new WorkspaceService();
    this.currentProvider = this.workspaceService.getWorkspaceConfig().LLMProvider
    this.serviceProvider = undefined;
    this.init_done = 0;
    this.checkLLMConfig()
    
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
  }

  createFormData(filePath) {
    const newFile = fs.createReadStream(filePath);
    const formData = new FormData();
    const fileName = path.basename(filePath);
    formData.append("file", newFile, fileName);
    return formData;
  }

  async uploadPrompts(filePath, uploadedPrompts, jsonKey) {
    const { authType, authToken, serverURL } =
      this.workspaceService.getWorkspaceConfig();
    const formData = this.createFormData(filePath);
    const response = await this.request(`${serverURL}/prompts`)
      .method("POST")
      .headers({ "Content-Type": "multipart/form-data" })
      .body(formData)
      .auth(authType, authToken)
      .send();
    uploadedPrompts[jsonKey] = path.basename(filePath);
    return response.data;
  }

  async askAlita({ prompt, template }) {
    try {
      return await this.serviceProvider.predict(template, prompt)
    } catch (ex) {
      await vscode.window.showErrorMessage(`Alita is not able to connect ${ex.stack}`);
      return "You need to configure LLM Provider first"
    }
  }

  async askOptions({ embedding, prompt, top_k, cutoff, type="append" }) {
    let result = await this.serviceProvider.similarity(embedding, prompt.trim(), top_k, cutoff )
    return {
      content: result.trim(),
      type: type
    }
  }
};
