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
const { alitaService, windowService, workspaceService } = require("../services");

module.exports = async function () {
  alitaService.checkLLMConfig();
  const embeddings = await workspaceService.updateEmbeddings();
  const selection = await windowService.showQuickPick([...embeddings]);
  if (!selection) return;

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: "Alita is baking your answer...",
      cancellable: false,
    },
    (progress) => {
      const p = new Promise((resolve) => {
        const { sel_start, sel_end, selText } = windowService.getSelectedText();
        vscode.window.activeTextEditor.selection = new vscode.Selection(sel_end, sel_end);
        progress.report({ increment: 5 });
        alitaService
          .askOptions({
            embedding: selection.label,
            prompt: selText,
            top_k: selection.top_k,
            cutoff: selection.cutoff,
          })
          .then((answer) => {
            progress.report({ increment: 90 });
            if (answer.type == "split") {
              const editor = vscode.window.activeTextEditor;
              const languageId = editor.document.languageId;
              vscode.workspace.openTextDocument({ language: languageId }).then((doc) => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true).then((editor) => {
                  editor.edit((editBuilder) => {
                    editBuilder.insert(new vscode.Position(0, 0), answer.content);
                  });
                });
              });
            } else if (answer.type == "replace") {
              vscode.window.activeTextEditor.edit((editBuilder) => {
                editBuilder.replace(new vscode.Range(sel_start, sel_end), answer.content);
              });
            } else {
              vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(answer.content), sel_end);
            }
            progress.report({ increment: 5 });
            resolve();
          })
          .catch((ex) => {
            console.log(ex);
            resolve();
          });
      });
      return p;
    }
  );
};
