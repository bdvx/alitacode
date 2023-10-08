const vscode = require("vscode");
const { alitaService, workspaceService } = require("../services");

module.exports = async function () {
  try {
    alitaService.checkLLMConfig()
    await alitaService.serviceProvider.init()
    alitaService.init_done = 1;
    await workspaceService.updateEmbeddings()
  } catch (e) {
    await vscode.window.showErrorMessage(
      `Alita is not able to connec to ${alitaService.serviceProvider.getEmbeddingsUrl}`);
  }
}
