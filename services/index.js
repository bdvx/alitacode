const AlitaService = require("./alita.service");
const WorkspaceService = require("./workspace.service");
const WindowService = require("./window.service");

module.exports = {
  alitaService: new AlitaService(),
  workspaceService: new WorkspaceService(),
  windowService: new WindowService(),
};
