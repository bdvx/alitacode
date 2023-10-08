const BaseOpenAIProvider = require("./base.openai.provider");

module.exports = class AzureOpenAIProvider extends BaseOpenAIProvider {
    constructor() {
        super("azure");
    }
}
