const { provideVSCodeDesignSystem, allComponents } = require("@vscode/webview-ui-toolkit");
provideVSCodeDesignSystem().register(allComponents);