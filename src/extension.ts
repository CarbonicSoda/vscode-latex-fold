import { ExtensionContext, languages } from "vscode";

import { LaTeXFoldingRangeProvider } from "./foldingRangeProvider";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(languages.registerFoldingRangeProvider("latex", new LaTeXFoldingRangeProvider()));
}

export function deactivate() {}
