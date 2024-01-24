
module.exports = {
  ERROR: {
    ADD_EXAMPLE: {
      NO_INPUT_OR_OUTPUT: `Content should have input: and output: in selected text`,
    },
    COMMON: {
      READ_FILE: (filePath, error) =>
        `Couldn't read file in next path: ${filePath}.\nError: ${JSON.stringify(
          error,
          null,
          2
        )}`,
      WRITE_FILE: (filePath, error) =>
        `Couldn't write content in next path: ${filePath}\nError: ${JSON.stringify(
          error,
          null,
          2
        )}`,
      SHOULD_HAVE_PROMPT: `Selected prompt doesn't have template, please specify template!`,
      SHOULD_HAVE_ITEMS: "Should have items",
      SHOULD_HAVE_BASE_PATH: "Should have basePath",
      SHOULD_HAVE_AT_LEAST: (len = 1) => `Should have at least ${len} symbols`,
      FILE_NOT_EXISTS: (path, error) =>
        `File in next path ${path} doesn't exists.\nError: ${JSON.stringify(
          error,
          null,
          2
        )}\n`,
    },
  },
  WORKSPACE: {
    EXTENSION: {
      NAME: "alitacode",
      PARAM: {
        ENABLE: "enable",
        PROMPT_LIB: "promptLib",
        LLM_SERVER_URL: "providerServerURL",
        LLM_TOKEN: "authToken",
        LLM_PROVIDER_TYPE: "serviceProviderForLLM",
        LLM_MODEL_NAME: "modelName",
        LLM_API_VERSION: "apiVersion",
        TOP_P: "topP",
        TOP_K: "topK",
        MAX_TOKENS: "maxTokens",
        TEMPERATURE: "temperature",
        PROJECTID: "projectId",
        INTEGRATIONID: "integrationUid",
        CUSTOM_MODEL_NAME: "customModelName",
        DEFAULT_TOKENS: "customModelTokens",
        DEFAULT_VIEW_MODE: "defaultViewMode",
      },
    },
  },
  COMMAND: {
    INIT_ALITA: "alitacode.initAlita",
    SYNC_PROMPTS: "alitacode.syncPrompts",
    SYNC_EMBEDDINGS: "alitacode.syncEmbeddings",
    ADD_EXAMPLE: "alitacode.addExample",
    ADD_CONTEXT: "alitacode.addContext",
    CREATE_PROMPT: "alitacode.createPrompt",
    PREDICT: "alitacode.predict",
    SUGGEST: "alitacode.suggest",
    OPEN_SETTINGS: "workbench.action.openSettings",
    ADD_GOOD_PREDICTION: "alitacode.addGoodPrediction",
  },
  TEXT: {
    ALITA_ACTIVATED: "Alita was activated! Please specify configuration",
    ENTER_PROMPT_NAME: "Enter prompt name",
    ENTER_PROMPT_DESCRIPTION: "Enter prompt description",
    ENTER_PROMPT_CONTEXT: "Enter context",
  },
  BUTTON: {
    SETTINGS: "Settings",
  },
  MESSAGE: {
    CONTEXT_WAS_ADDED: (label) => `Context was added to ${label} prompt!`,
  },
  EXTERNAL_PROMPTS_PROVIDERS: ["Alita", "DigitalPlatform"],
  LOCAL_PROMPTS_BLOCKERS: ["DigitalPlatform"],
};
