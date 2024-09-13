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

const LlmServiceProvider = require("./base.provider");
const { OpenAIClient, OpenAIKeyCredential, AzureKeyCredential} = require("@azure/openai");


module.exports = class BaseOpenAIProvider extends LlmServiceProvider {
    constructor(provider = "openai") {
        super();
        switch (provider) {
            case "openai":
                this.openai = new OpenAIClient(
                    new OpenAIKeyCredential(this.config.LLMauthToken)
                )
                break;
            default:
                this.openai = new OpenAIClient(
                    this.config.LLMserverURL,
                    new AzureKeyCredential(this.config.LLMauthToken),
                    { apiVersion: this.config.LLMApiVersion }
                )
        }
    }

    async predict(template, prompt) {
        const config = this.workspaceService.getWorkspaceConfig();
        const prompt_template = await this.getPromptTemplate(config, template.template);
        
        try{
            const events = await this.openai.getChatCompletions(
                config.LLMmodelName,
                this.chatify_template(prompt_template, prompt),
                {
                    maxTokens: prompt_template.maxTokens ? prompt_template.maxTokens : config.maxTokens,
                    temperature: prompt_template.temperature ? prompt_template.temperature : config.temperature,
                    topP: prompt_template.topP ? prompt_template.topP : config.topP,
                    n: 1
                }
            )
            return { 
                "content": events.choices[0].message.content,
                "type": prompt_template.display_type ? 
                    prompt_template.display_type : 
                    this.workspaceService.getWorkspaceConfig().DisplayType
            }
            
        } catch (err) {
            if (err.error) {
                return `ERROR: ${err.error.message}`
            } else {
                console.log(err)
            }
            return "Something went wrong on Open AI Side, please check your configuration"
        }
    }
}