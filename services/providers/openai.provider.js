const BaseOpenAIProvider = require("./base.openai.provider");

module.exports =  class OpenAIServiceProvider extends BaseOpenAIProvider {
    constructor() {
        super("openai");
    }
}
