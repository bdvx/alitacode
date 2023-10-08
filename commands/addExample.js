const { windowService, workspaceService } = require("../services");
const vscode = require("vscode");
const path = require("path");
const { ERROR } = require("../constants");

const INPUT_OUTPUT_REGEXP =
  /(input:(\s*\S.*)output:(\s*\S.*)|output:(\s*\S.*)input:(\s*\S.*))/s; // should be in text 1 times
const EXTRACT_OUTPUT_REGEXP = /input:(\s*\S.*)output:(\s*\S.*)/s

module.exports = async function (items) {
  const { workspacePath, promptLib } = workspaceService.getWorkspaceConfig();
  const { selText } = windowService.getSelectedText();
  if (!INPUT_OUTPUT_REGEXP.test(selText)) {
    await vscode.window.showErrorMessage(ERROR.ADD_EXAMPLE.NO_INPUT_OR_OUTPUT);
    throw new Error(ERROR.ADD_EXAMPLE.NO_INPUT_OR_OUTPUT);
  }
  var res = selText.match(EXTRACT_OUTPUT_REGEXP);
  
  await workspaceService.addContentToTemplate({
    items,
    selText: {"input": res[0].trim(), "output": res[1].trim()},
    basePath: path.join(workspacePath, promptLib),
    templateKey: "examples"
  });
};
