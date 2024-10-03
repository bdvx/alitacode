const vscode = require("vscode");
const OutputService = require("../services/output.service");

const SHOW_LOGS_BUTTON = "Show logs";

module.exports = class Notifications {
  static async showError({ error, message, showOutputButton }) {
    const buttons = showOutputButton ? [SHOW_LOGS_BUTTON] : undefined;
    const response = await vscode.window.showErrorMessage(`${message}. ${error ? error.stack : ""}`, ...buttons);

    if (response === SHOW_LOGS_BUTTON) {
      OutputService.show();
    }

    return response;
  }
};
