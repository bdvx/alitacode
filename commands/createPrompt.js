const path = require("path");
const {
  workspaceService,
  windowService,
} = require("../services");
const { TEXT } = require("../constants");

module.exports = async function (items) {
  const { promptLib, workspacePath } = workspaceService.getWorkspaceConfig();
  const promptName = await windowService.showInputBox({
    title: TEXT.ENTER_PROMPT_NAME,
  });
  const promptDescription = await windowService.showInputBox({
    title: TEXT.ENTER_PROMPT_DESCRIPTION,
  });
  const context = await windowService.showInputBox({
    title: TEXT.ENTER_PROMPT_CONTEXT,
  });
  if (!promptName || !promptDescription || !context) return;

  const normalizedPromptName = promptName.replace(/[^\w\d]/g, "_");
  const newPromptFileName = `${normalizedPromptName}.yaml`;

  await workspaceService.writeContent(
    path.join(workspacePath, promptLib, newPromptFileName),
    {"context": context}
  );
  const promptsMapping = await workspaceService.readContent(
    path.join(workspacePath, promptLib, "./prompts.json"),
    true
  );
  promptsMapping[promptName] = {
    description: promptDescription,
    template: newPromptFileName,
    external: false
  };
  await workspaceService.writeContent(
    path.join(workspacePath, promptLib, "./prompts.json"),
    promptsMapping,
    true
  );

  items.add({ label: promptName, description: promptDescription, template: newPromptFileName });
  // await alitaService.uploadPrompts(
  //   path.join(workspacePath, promptLib, newPromptFileName),
  //   uploadedPrompts,
  //   promptName
  // );
};
