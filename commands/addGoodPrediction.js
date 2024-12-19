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
const path = require("path");

module.exports = async function () {
  const { workspacePath, promptLib } = workspaceService.getWorkspaceConfig();
  const { selText } = windowService.getSelectedText();
  const predictsFilePath = path.join(workspacePath, promptLib, "./predicts.jsonl");
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
