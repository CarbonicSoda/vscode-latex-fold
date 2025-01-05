import { FoldingRange, FoldingRangeProvider, TextDocument } from "vscode";

export class LaTeXFoldingRangeProvider implements FoldingRangeProvider {
	provideFoldingRanges(doc: TextDocument): FoldingRange[] {
		const text = doc.getText();
		const sectionRanges = this.#getSectionRanges(doc, text);
		const envRanges = this.#getEnvRanges(doc, text);
		return sectionRanges.concat(envRanges);
	}

	#LATEX_SECTION_LEVELS = [
		"part",
		"chapter",
		"section",
		"subsection",
		"subsubsection",
		"paragraph",
		"subparagraph",
	];

	#LATEX_SECTION_PATTERNS = this.#LATEX_SECTION_LEVELS.map((level) => {
		const delimiter = `\\\\${level}\\s*\\*?\\s*{.*?}`;
		return `(?<head>${delimiter}).*?(?=${delimiter}|\\\\end\\s*{document}|$)`;
	});

	#LATEX_SECTIONS_RE = RegExp(
		`(?:${this.#LATEX_SECTION_PATTERNS.join(")|(?:")})`,
		"gs",
	);

	#getSectionRanges(
		doc: TextDocument,
		text: string,
		_offset: number = 0,
	): FoldingRange[] {
		const sectionRanges = [];
		for (const match of text.matchAll(this.#LATEX_SECTIONS_RE)) {
			const matchText = match[0];
			const startOffset = _offset + match.index;
			const endOffset = startOffset + matchText.length;

			const startLine = doc.positionAt(startOffset).line;
			let endLine = doc.positionAt(endOffset).line;
			if (
				endLine < doc.lineCount - 1 ||
				doc
					.lineAt(doc.lineCount - 1)
					.text.match(/\\end\s*{document}/s)
			) {
				endLine--;
			}
			sectionRanges.push(
				new FoldingRange(startLine, endLine),
			);

			const head = match.groups!.head;
			const headOffset = head.length;
			const sectionText = matchText.slice(headOffset);
			sectionRanges.push(
				...this.#getSectionRanges(
					doc,
					sectionText,
					startOffset + headOffset,
				),
			);
		}
		return sectionRanges;
	}

	#getEnvRanges(doc: TextDocument, text: string): FoldingRange[] {
		const envRE =
			/(?<begin>\\begin\s*{.+?})|(?<end>\\end\s*{.+?})/gs;

		let excessEnd = false;
		const startOffsets: number[] = [];
		const endOffsets: (number | undefined)[] = [];
		for (const match of text.matchAll(envRE)) {
			const offset = match.index;
			if (match.groups!.begin) {
				startOffsets.push(offset);
				continue;
			}
			let i = startOffsets.length - 1;
			while (endOffsets[i]) i--;
			if (i < 0) {
				excessEnd = true;
				break;
			}
			endOffsets[i] = offset;
		}
		if (
			excessEnd ||
			endOffsets.length !== startOffsets.length ||
			endOffsets.includes(undefined)
		) {
			return [];
		}

		return startOffsets.map((startOffset, i) => {
			const endOffset = <number>endOffsets[i];
			const beginLine = doc.positionAt(startOffset).line;
			const endLine = doc.positionAt(endOffset).line;
			return new FoldingRange(beginLine, endLine);
		});
	}
}
