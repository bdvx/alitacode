// Copyright 2023 EPAM Systems
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
