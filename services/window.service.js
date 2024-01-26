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

const vscode = require("vscode");

module.exports = class WindowService {
  getSelectedText() {
    const sel_start = vscode.window.activeTextEditor.selection.start;
    const sel_end = vscode.window.activeTextEditor.selection.end;
    const selRange = new vscode.Range(
      sel_start.line,
      sel_start.character,
      sel_end.line,
      sel_end.character
    );
    const selText = vscode.window.activeTextEditor.document
      .getText(selRange)
      .trim();
    return { sel_start, sel_end, selRange, selText };
  }

  async showInputBox(options) {
    return vscode.window.showInputBox(options);
  }

  async showQuickPick(items) {
    return vscode.window.showQuickPick(items);
  }
};
