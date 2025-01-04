import { FoldingRange, FoldingRangeProvider, TextDocument } from "vscode";

export class LaTeXFoldingRangeProvider implements FoldingRangeProvider {
	static #LATEX_SECTION_LEVELS = [
		"part",
		"chapter",
		"section",
		"subsection",
		"subsubsection",
		"paragraph",
		"subparagraph",
	];
	static #LATEX_SECTION_LEVEL_PATTERNS = this.#LATEX_SECTION_LEVELS.map((level) => {
		const delimiter = `\\\\${level}\\*?{.*?}`;
		return `(?<head>${delimiter}).*?(?=${delimiter}|\\\\end{document}|$)`;
	});
	static #LATEX_FOLDING_RANGE_RE = RegExp(`(?:${this.#LATEX_SECTION_LEVEL_PATTERNS.join(")|(?:")})`, "gs");

	static #getSectionRanges(doc: TextDocument, text: string, _offset: number = 0): FoldingRange[] {
		const sectionRanges = [];
		for (const match of text.matchAll(this.#LATEX_FOLDING_RANGE_RE)) {
			const matchText = match[0];
			const startOffset = _offset + match.index;
			const endOffset = startOffset + matchText.length;

			const startLine = doc.positionAt(startOffset).line;
			let endLine = doc.positionAt(endOffset).line;
			if (endLine < doc.lineCount - 1 || doc.lineAt(doc.lineCount - 1).text.match(/\\end{document}/s)) {
				endLine--;
			}
			sectionRanges.push(new FoldingRange(startLine, endLine));

			const head = match.groups!.head;
			const headOffset = head.length;
			const sectionText = matchText.slice(headOffset);
			sectionRanges.push(...this.#getSectionRanges(doc, sectionText, startOffset + headOffset));
		}
		return sectionRanges;
	}

	provideFoldingRanges(doc: TextDocument): FoldingRange[] {
		const text = doc.getText();
		return LaTeXFoldingRangeProvider.#getSectionRanges(doc, text);
	}
}
