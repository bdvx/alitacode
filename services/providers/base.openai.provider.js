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
                    this.workspaceService.getWorkspaceConfig().DefaultViewMode
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