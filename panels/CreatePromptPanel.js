import {getUri} from "../utilities/getUri";
import {createPrompt} from "../commands";

const vscode = require("vscode");
export class CreatePromptPanel {
 /* private _panel: any;
  private _disposables: any[];
  private static currentPanel: any;*/

  constructor(panel, extensionUri) {
    this._panel = panel;
    this._disposables = []
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
  }

  static render(context, workspaceServicePrompts) {
    if (CreatePromptPanel.currentPanel) {
      CreatePromptPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("alitacode", "Create Prompt", vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "out")]
      });

      CreatePromptPanel.currentPanel = new CreatePromptPanel(panel, context.extensionUri);
      CreatePromptPanel.currentPanel._addReceiveMessageHandler(context, workspaceServicePrompts)
    }
  }

  _addReceiveMessageHandler(context, workspaceServicePrompts) {
    CreatePromptPanel.currentPanel._panel.webview.onDidReceiveMessage(
        async message => {
          switch (message.command) {
            case "save":
              //const {promptName, promptDescription, newPromptFileName} = message.promptSettings
              await createPrompt(workspaceServicePrompts, message.promptSettings)
              vscode.window.showInformationMessage( "Prompt saved!");
              return;
          }
        },
        undefined,
        context.subscriptions
    );
  }

  dispose() {
    CreatePromptPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  _getWebviewContent(webview, extensionUri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview.js"]);
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Prompt</title>
    </head>
    <body>
        <script>
          const vscode = acquireVsCodeApi();
           const basicElementsArray = [
              "promptName", "promptDescription", "context"
            ]
            const integrationElementsArray = [
              "promptModel",
              "promptTopP",
              "promptTopK",
              "promptTemperature",
              "promptMaxTokens",
            ]
          function useProjectIntegrationFields(state) {
            if(!state.checked){
              integrationElementsArray.forEach(
               (element) => document.getElementsByName(element)[0].setAttribute("disabled", "true"))
            } else {
              integrationElementsArray.forEach(
               (element) => document.getElementsByName(element)[0].removeAttribute("disabled"))
            }
          }
          function savePrompt() {
            const promptSettings = Object.create({})
            basicElementsArray.forEach(
                (element) => { promptSettings[element] = document.getElementsByName(element)[0].value })
            const normalizedPromptName = promptSettings.promptName.replace(/[^\\w\\d]/g, "_");
            promptSettings.newPromptFileName = normalizedPromptName + ".yaml";
            vscode.postMessage({
                command: 'save',
                promptSettings
            })
          }
          useProjectIntegrationFields({checked: false})
        </script>
        <script type="module" src="${webviewUri}"></script>
        <vscode-text-field name="promptName">Name</vscode-text-field>
        <br />
        <vscode-text-field  name="promptDescription">Description</vscode-text-field>
        <br />
        <vscode-text-area name="context" rows="4" cols="50">Context</vscode-text-area>
        <br />
        <label>
          <vscode-checkbox id="useProjectIntegration" onclick="useProjectIntegrationFields(this)" class="ws-input" />
          Use project integration settings in context file
        </label>
        <br />
        <vscode-text-field  name="promptModel">Model</vscode-text-field>
        <br />
        <vscode-text-field  name="promptTopP">Top P</vscode-text-field>
        <br />
        <vscode-text-field  name="promptTopK">Top K</vscode-text-field>
        <br />
        <vscode-text-field  name="promptTemperature">Temperature</vscode-text-field>
        <br />
       <vscode-text-field  name="promptMaxTokens">Max Tokens</vscode-text-field>
       <vscode-button appearance="primary" name="save-prompt" onclick="savePrompt()">Save</vscode-button>
       <!-- <input type="text" name="promptName">Name</input>
        <br />
        <input type="text"  name="promptDescription">Description</input>
        <br />
        <textarea name="promptContext" rows="4" cols="50">Context</textarea>
        <br />
        <label>
          <input type="checkbox" 
          id="useProjectIntegration" 
          onclick="useProjectIntegrationFields(this)" 
          class="ws-input" />
          Use project integration settings in context file
        </label>
        <br />
        <input type="text" name="promptModel">Model</input>
        <br />
        <input type="text" name="promptTopP">Top P</input>
        <br />
        <input type="text" name="promptTopK">Top K</input>
        <br />
        <input type="text" name="promptTemperature">Temperature</input>
        <br />
       <input type="text" name="promptMaxTokens">Max Tokens</input>
       <button appearance="primary" name="save-prompt">Save</button>-->
    </body>
    </html>
    `;
  }
}