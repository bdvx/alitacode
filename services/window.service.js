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
