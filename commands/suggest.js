const vscode = require("vscode");
const { alitaService, windowService, workspaceService} = require("../services");

module.exports = async function () {
  alitaService.checkLLMConfig()
  const embeddings = await workspaceService.updateEmbeddings();
  const selection = await windowService.showQuickPick([...embeddings]);
  if (!selection) return;
  
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Window,
    title: "Alita is baking your answer...",
    cancellable: false
  }, (progress) => {
    const p = new Promise(resolve => {
      const { sel_start, sel_end, selText } = windowService.getSelectedText();
      vscode.window.activeTextEditor.selection = new vscode.Selection(
        sel_end,
        sel_end
      );
      progress.report({ increment: 5 });
      alitaService.askOptions({
        embedding: selection.label,
        prompt: selText,
        top_k: selection.top_k,
        cutoff: selection.cutoff
      }).then((answer) => {
        progress.report({ increment: 90 });
        if (answer.type == "split")  {
          const editor = vscode.window.activeTextEditor;
          const languageId = editor.document.languageId
          vscode.workspace.openTextDocument({ language: languageId }).then(doc => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true).then(editor => {
              editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), answer.content);
              })
            })
          })
        } else if (answer.type == "replace") {
          vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(
              new vscode.Range(sel_start, sel_end),
              answer.content
            );
          });
        } else {
          vscode.window.activeTextEditor.insertSnippet(
            new vscode.SnippetString(answer.content),
            sel_end
          );
        }
        progress.report({ increment: 5 });
        resolve()
      }).catch((ex) => {
        console.log(ex)
        resolve();
      });
    });
    return p;
  });
}
