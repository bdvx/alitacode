const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const { LOCAL_PROMPTS_BLOCKERS } = require("../constants/index");

module.exports = async function () {
    const { workspaceService } = require("../services");
    const { promptLib, workspacePath, LLMProvider} = workspaceService.getWorkspaceConfig();
    await vscode.commands.executeCommand("setContext", "alitacode.LLMProvider", LLMProvider);
    await vscode.commands.executeCommand("setContext", 
        "alitacode.LocalPrompts", !LOCAL_PROMPTS_BLOCKERS.includes(LLMProvider));
    if (promptLib && fs.existsSync(path.join(workspacePath, promptLib, "./prompts.json"))) {
      await vscode.commands.executeCommand("setContext", "alita.init", true);
      return await workspaceService.updatePrompts();
    } else {
      return await vscode.commands.executeCommand("setContext", "alita.init", false);
    }
  }