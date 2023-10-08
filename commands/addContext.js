const { windowService, workspaceService } = require("../services");
const path = require("path");

module.exports = async function (items) {
  const { promptLib, workspacePath } = workspaceService.getWorkspaceConfig();
  const { selText } = windowService.getSelectedText();
  await workspaceService.addContentToTemplate({
    items,
    selText,
    basePath: path.join(workspacePath, promptLib),
    templateKey: "context",
  });
};
