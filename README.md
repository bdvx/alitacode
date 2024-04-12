# Alita Code


Introducing AlitaCode for VSCode, the ultimate AI-powered IDE extension that revolutionizes the way you develop, test, and maintain your code. AlitaCode harnesses the power of generative AI to provide intelligent suggestions, streamline code implementation, and automate essential tasks, elevating your coding experience to new heights. With customizable internal and external prompts, AlitaCode offers an unparalleled level of adaptability, catering to your unique project needs and preferences.

# Why AlitaCode?

## Boost productivity with AI-powered suggestions

AlitaCode intelligently analyzes your code and provides real-time suggestions for implementing features, enhancing code readability, and optimizing performance. Save time and effort while crafting high-quality code.

## Automate testing and documentation

Generate unit-tests, integration tests, and automated tests with ease, ensuring your code is robust and reliable. AlitaCode also automatically adds comments to your code, making it more understandable and maintainable for your team.

## Customizable prompts for personalized assistance

Tailor AlitaCode to your specific needs with customizable internal and external prompts. Create and modify prompts within your IDE, or leverage the power of Alita Backend's large language model for external prompts, offering an unparalleled level of adaptability.


# Features list:

- AI-powered code suggestions
- Automated unit-test generation
- Integration test generation
- Automated test creation
- Automatic code commenting
- Customizable internal prompts
- Project-specific external prompts powered by Alita Backend
- Code explanation and optimization recommendations
- Native IDE integration
- Regular updates and improvements
- Comprehensive documentation and support
- Collaboration-friendly design for team projects
- Secure and privacy-conscious implementation

# Extension Commands
- Alita: Init - Initialize AlitaCode and create .promptLib folder in a root of your open workspace
- Alita: Create Prompt - Create a new prompt in .promptLib folder
- Alita: Extend Context - Extend context of the prompt in .promptLib folder
- Alita: Predict - Provide a list of prompts to choose from and generate prediction based on the selected prompt
- Alita: Similarity - Provide list of embedding to run similarity search against
- Alita: Sync External Prompts - Sync external prompts from Alita Backend
- Alita: Sync Embeddings - Sync embeddings from Alita Backend


# Supported LLM providers
- Alita - https://projectalita.ai
- EPAM Dial - https://epam-rail.com
- OpenAI - https://openai.com
- Azure Open AI - https://azure.microsoft.com/en-us/products/ai-services/openai-service


# Extension Settings

This extension contributes the following settings:
- alitacode.enable: enable/disable this extension
- alitacode.serviceProviderForLLM: select the LLM provider (Alita, OpenAI, Azure Open AI)
- alitacode.authToken: API key for the selected LLM provider
- alitacode.providerServerURL: URL of the LLM provider server
- alitacode.apiVersion: Api version, mostly applicable for Azure OpenAI compatible APIs
- alitacode.modelName: Default model name used for local prompts (Can be overwritten in prompt)
- alitacode.projectId (optional): Project ID for external prompts (ignored for any OpenAI)
- alitacode.integrationUid (optional): Integration UID for external prompts (ignored for any OpenAI)
- alitacode.temperature: Default temperature for model (Can be overwritten in prompt)
- alitacode.maxTokens: Default max tokens for model (Can be overwritten in prompt)
- alitacode.topP: Default top P for model (Can be overwritten in prompt)
- alitacode.topK: Default top K for model (Can be overwritten in prompt)


# Development

Run build and package and then install the generated `.vsix` 

## Build

`npm run esbuild`

## Package

`npm run vsce`

Run following and VS Code's "Run" >> "Start Debugging" to debug extension with auto rebuild.

## Development

`npm run esbuild-watch`


