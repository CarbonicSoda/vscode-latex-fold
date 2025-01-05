import { ExtensionContext, languages } from "vscode";
import { LaTeXFoldingRangeProvider } from "./foldingRangeProvider";

export function activate(context: ExtensionContext) {
	const disposable = languages.registerFoldingRangeProvider(
		"latex",
		new LaTeXFoldingRangeProvider(),
	);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
