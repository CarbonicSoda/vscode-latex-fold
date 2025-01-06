import { FoldingRange, TextDocument } from "vscode";

const ENV_RE = /(?<begin>\\begin\s*{.+?})|(?<end>\\end\s*{.+?})/gs;

export function getEnvRanges(doc: TextDocument, text: string): FoldingRange[] {
	let excessEnd = false;
	const startOffsets: number[] = [];
	const endOffsets: (number | undefined)[] = [];
	for (const match of text.matchAll(ENV_RE)) {
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
	if (excessEnd || endOffsets.length !== startOffsets.length || endOffsets.includes(undefined)) {
		return [];
	}

	return startOffsets.map((startOffset, i) => {
		const endOffset = <number>endOffsets[i];
		const beginLine = doc.positionAt(startOffset).line;
		const endLine = doc.positionAt(endOffset).line;
		return new FoldingRange(beginLine, endLine);
	});
}
