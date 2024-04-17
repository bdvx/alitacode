// Copyright 2024 EPAM Systems
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

const CarrierServiceProvider = require("./carrier.provider");
const { URL }= require("url");
const apiPath = "/api/v1"
const socketPath = "/socket.io"

module.exports = class AlitaServiceProvider extends CarrierServiceProvider {
    constructor() {
        super();
        const apiBasePath = this.config.LLMserverURL.concat(apiPath);
        this.getPromptsUrl = `${apiBasePath}/prompt_lib/prompts/prompt_lib/${this.config.projectID}`;
        this.getPromptDetailUrl = `${apiBasePath}/prompt_lib/prompt/prompt_lib/${this.config.projectID}`
        this.getDatasourcesUrl =
            `${apiBasePath}/datasources/datasources/prompt_lib/${this.config.projectID}`;
        this.getDatasourceDetailUrl =
            `${apiBasePath}/datasources/datasource/prompt_lib/${this.config.projectID}`;
        this.updatePromptsUrl = `${apiBasePath}/prompt_lib/version/prompt_lib/${this.config.projectID}`;
        this.predictUrl = `${apiBasePath}/prompt_lib/predict/prompt_lib/${this.config.projectID}`;
        this.getEmbeddingsUrl =
            `${apiBasePath}/integrations/integrations/default/${this.config.projectID}`;
        this.sumilarityUrl = `${apiBasePath}/datasources/deduplicate/prompt_lib/${this.config.projectID}`;
        this.chatWithDatasourceUrl = `
            ${apiBasePath}/datasources/predict/prompt_lib/${this.config.projectID}`;
    }

    getSocketConfig() {
        const config = this.workspaceService.getWorkspaceConfig();
        const socketUrl = config.LLMserverURL;
        const socketPrefix = socketUrl.indexOf("https") === 0 ? "wss://" : "ws://";
        const urlObject = new URL(socketUrl);
        return {
            projectId: config.projectID,
            host: socketPrefix + urlObject.host,
            path: urlObject.pathname && urlObject.pathname.concat(socketPath),
        };
    }

    getModelSettings() {
        const config = this.workspaceService.getWorkspaceConfig();
        return {
            model: {
                model_name: config.LLMmodelName,
                integration_uid: config.integrationID,
            },
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            top_p: config.topP,
            top_k: config.topK,
            stream: true,
        }
    }

    async predict(template, prompt, prompt_template = undefined) {
        const config = this.workspaceService.getWorkspaceConfig();
        var prompt_data = {}
        var display_type = "append"
        if (template.external) {
            prompt_data = {
                project_id: config.projectID,
                prompt_id: prompt_template.prompt_id,
                model_settings: this.getModelSettings(),
                user_input: prompt,
                variables: prompt_template.variables,
                chat_history: prompt_template.chat_history
            };
            if (template.userSettings) {
                display_type = template.userSettings.display_type ? template.userSettings.display_type : "append"

                if (template.userSettings.temperature) {
                    prompt_data.temperature = template.userSettings.temperature
                }
                if (template.userSettings.maxTokens) {
                    prompt_data.max_tokens = template.userSettings.maxTokens
                    prompt_data.max_decode_steps = template.userSettings.maxTokens
                }
                if (template.userSettings.topP) {
                    prompt_data.top_p = template.userSettings.topP
                }
                if (template.userSettings.topK) {
                    prompt_data.top_k = template.userSettings.topK
                }
                if (template.userSettings.modelName) {
                    prompt_data.model_name = template.userSettings.modelName
                }
            }
        } else {
            if (!prompt_template) {
                prompt_template = await this.getPromptTemplate(config, template.template);
            }
            prompt_data = {
                project_id: config.projectID,
                model_settings: {
                    model: {
                        model_name: prompt_template.model_name ? prompt_template.model_name : config.LLMmodelName,
                        integration_uid:
                            prompt_template.integration_id ? prompt_template.integration_id : config.integrationID,
                    },
                    temperature: prompt_template.temperature ? prompt_template.temperature : config.temperature,
                    max_tokens: prompt_template.maxTokens ? prompt_template.maxTokens : config.maxTokens,
                    top_p: prompt_template.topP ? prompt_template.topP : config.topP,
                    top_k: prompt_template.topK ? prompt_template.topK : config.topK,
                    stream: true,
                },
                context: prompt_template.context,
                user_input: prompt,
                variables: Object.entries(this.getTemplateDefaults())
                    .map(([key, value]) => ({ name: key, value: value })),
                chat_history: prompt_template.chat_history
            };
        }
        display_type = (prompt_template && prompt_template.display_type) ?
            prompt_template.display_type :
            this.workspaceService.getWorkspaceConfig().DefaultViewMode;
        const response = await this.request(this.predictUrl)
            .method("POST")
            .headers({ "Content-Type": "application/json", })
            .body(prompt_data)
            .auth(this.authType, this.authToken)
            .send();
        // escape $ sign as later it try to read it as template variable
        const resp_data = response.data.messages.map((message) => message.content.replace(/\$/g, "\\$")).join("\n")
        return {
            "content": resp_data,
            "type": display_type
        };
    }

    async getPromptDetail(promptId) {
        const response = await this.request(this.getPromptDetailUrl + "/" + promptId)
            .method("GET")
            .headers({ "Content-Type": "application/json" })
            .auth(this.authType, this.authToken)
            .send();
        return response.data;
    }

    async getDatasourceDetail(id) {
        const response = await this.request(this.getDatasourceDetailUrl + "/" + id)
            .method("GET")
            .headers({ "Content-Type": "application/json" })
            .auth(this.authType, this.authToken)
            .send();
        return response.data;
    }

    async getDatasources() {
        const response = await this.request(this.getDatasourcesUrl)
            .method("GET")
            .headers({ "Content-Type": "application/json" })
            .auth(this.authType, this.authToken)
            .send();
        return response.data;
    }

    async chat({
        prompt_id,
        datasource_id,
        user_input,
        chat_history
    }) {
        let url
        let body

        if (prompt_id) {
            url = this.predictUrl + "/" + prompt_id
            body = {
                user_input,
                chat_history
            }
        } else if (datasource_id) {
            url = this.chatWithDatasourceUrl + "/" + datasource_id
            body = {
                input: user_input,
                chat_history,
            }
        } else {
            url = this.predictUrl
            body = {
                user_input,
                chat_history,
                model_settings: this.getModelSettings()
            }
        }

        const response = await this.request(url)
            .method("POST")
            .headers({ "Content-Type": "application/json" })
            .body(body)
            .auth(this.authType, this.authToken)
            .send();
        return datasource_id ? {
            ...response.data,
            content: response.data.response,
        } : (response.data.messages && response.data.messages[0]);
    }
}