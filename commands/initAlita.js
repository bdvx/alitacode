const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const { workspaceService } = require("../services");
const onConfigChange = require("./onConfigChange");
const defaultPrompts = require("../constants/defaultPrompts");


module.exports = async function () {
  const { promptLib, workspacePath } = workspaceService.getWorkspaceConfig();
  if (!fs.existsSync(path.join(workspacePath, promptLib))){
      fs.mkdirSync(path.join(workspacePath, promptLib));
  }
  if (!fs.existsSync(path.join(workspacePath, promptLib, "./prompts.json"))){
    var prompts = {}
    for (const promptKey of Object.keys(defaultPrompts)){
      const promptName = promptKey.replace(/_/g, " ");
      const promptDescription = defaultPrompts[promptKey].description;
      delete defaultPrompts[promptKey].description;
      workspaceService.writeContent(
        path.join(workspacePath, promptLib, `${promptKey}.yaml`),
        defaultPrompts[promptKey]
      );
      prompts[promptName] = {
        description: promptDescription,
        template: `${promptKey}.yaml`,
        external: false
      };
    }
    fs.writeFileSync(path.join(workspacePath, promptLib, "./prompts.json"), JSON.stringify(prompts, null, 2));
  }
  if (!fs.existsSync(path.join(workspacePath, promptLib, "./embeddings.json"))){
    fs.writeFileSync(path.join(workspacePath, promptLib, "./embeddings.json"), "{}");
  }
  await vscode.commands.executeCommand("setContext", "alita.init", true);
  return await onConfigChange();
};
