const vscode = require("vscode");
const { workspaceService } = require("./services");
const { COMMAND, EXTERNAL_PROMPTS_PROVIDERS } = require("./constants/index");
const {
  addContext,
  addExample,
  createPrompt,
  predict,
  addGoodPrediction,
  suggest,
  initAlita,
  syncPrompts,
  syncEmbeddings,
  onConfigChange
} = require("./commands");

async function activate(context) {
  await vscode.commands.executeCommand("setContext", "alitacode.ExtentablePlatforms", EXTERNAL_PROMPTS_PROVIDERS);
  try {
    await onConfigChange();
  } catch (error) {
    console.error(error);
  }
  

  vscode.workspace.onDidChangeConfiguration(async (e) => {
    await onConfigChange();
  });

  const predictSub = vscode.commands.registerCommand(
    COMMAND.PREDICT,
    predict.bind(null)
  );

  const suggestSub = vscode.commands.registerCommand(
    COMMAND.SUGGEST,
    suggest
  );

  const initAlitaSub = vscode.commands.registerCommand(
    COMMAND.INIT_ALITA,
    initAlita
  );
  
  const syncPromptsSub = vscode.commands.registerCommand(
    COMMAND.SYNC_PROMPTS,
    syncPrompts
  );

  const syncEmbeddingsSub = vscode.commands.registerCommand(
    COMMAND.SYNC_EMBEDDINGS,
    syncEmbeddings
  );

  const createPromptSub = vscode.commands.registerCommand(
    COMMAND.CREATE_PROMPT,
    createPrompt.bind(null, workspaceService.promptsList)
  );

  const addContextSub = vscode.commands.registerCommand(
    COMMAND.ADD_CONTEXT,
    addContext.bind(null, workspaceService.promptsList)
  );

  const addExampleSub = vscode.commands.registerCommand(
    COMMAND.ADD_EXAMPLE,
    addExample.bind(null, workspaceService.promptsList)
  );

  const addGoodPredictionSub = vscode.commands.registerCommand(
    COMMAND.ADD_GOOD_PREDICTION,
    addGoodPrediction
  );

  context.subscriptions.push(predictSub);
  context.subscriptions.push(suggestSub);
  context.subscriptions.push(createPromptSub);
  context.subscriptions.push(addContextSub);
  context.subscriptions.push(addExampleSub);
  context.subscriptions.push(addGoodPredictionSub);
  context.subscriptions.push(initAlitaSub);
  context.subscriptions.push(syncPromptsSub);
  context.subscriptions.push(syncEmbeddingsSub);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
