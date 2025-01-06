import { FoldingRange, TextDocument } from "vscode";

const SECTION_LEVELS = ["part", "chapter", "section", "subsection", "subsubsection", "paragraph", "subparagraph"];
const SECTION_PATTERNS = SECTION_LEVELS.map((level) => {
	const delimiter = `\\\\${level}\\s*\\*?\\s*{.*?}`;
	return `(?<head>${delimiter}).*?(?=${delimiter}|\\\\end\\s*{document}|$)`;
});
const SECTION_RE = RegExp(`(?:${SECTION_PATTERNS.join(")|(?:")})`, "gs");

export function getSectionRanges(doc: TextDocument, text: string, _offset = 0): FoldingRange[] {
	const sectionRanges = [];
	for (const match of text.matchAll(SECTION_RE)) {
		const matchText = match[0];
		const startOffset = _offset + match.index;
		const endOffset = startOffset + matchText.length;

		const startLine = doc.positionAt(startOffset).line;
		let endLine = doc.positionAt(endOffset).line;
		if (endLine < doc.lineCount - 1 || doc.lineAt(doc.lineCount - 1).text.match(/\\end\s*{document}/s)) {
			endLine--;
		}
		sectionRanges.push(new FoldingRange(startLine, endLine));

		const head = match.groups!.head;
		const headOffset = head.length;
		const sectionText = matchText.slice(headOffset);
		sectionRanges.push(...getSectionRanges(doc, sectionText, startOffset + headOffset));
	}
	return sectionRanges;
}
