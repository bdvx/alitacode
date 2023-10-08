const CarrierServiceProvider = require("./carrier.provider")
const OpenAIServiceProvider = require("./openai.provider")
const AzureOpenAIProvider = require("./azure.provider") 
const DigitalPlatform = require("./dp.provider")
const LlmServiceProvider = require("./base.provider");

module.exports = {
    "Alita": CarrierServiceProvider,
    "OpenAI": OpenAIServiceProvider,
    "DigitalPlatform": DigitalPlatform,
    "Azure OpenAI": AzureOpenAIProvider,
    "None": LlmServiceProvider
}