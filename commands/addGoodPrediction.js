const { windowService, workspaceService } = require("../services");
const path = require("path");

module.exports = async function () {
  const { workspacePath, promptLib } = workspaceService.getWorkspaceConfig();
  const { selText } = windowService.getSelectedText();
  const predictsFilePath = path.join(
    workspacePath,
    promptLib,
    "./predicts.jsonl"
  );
  try {
    await workspaceService.checkThatFileExists(predictsFilePath);
  } catch (error) {
    await workspaceService.writeContent(predictsFilePath, "");
  }
  const predictsFile = await workspaceService.readContent(predictsFilePath);
  const prompt = await windowService.showInputBox({
    title: "Enter prompt",
  });
  const newContent =
    predictsFile +
    "\n" +
    JSON.stringify({
      prompt,
      prediction: selText,
    });
  await workspaceService.writeContent(predictsFilePath, newContent);
};
