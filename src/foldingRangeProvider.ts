import { FoldingRange, FoldingRangeProvider, TextDocument } from "vscode";

import { getEnvRanges } from "./folding_ranges/envRanges";
import { getSectionRanges } from "./folding_ranges/sectionRanges";

const RANGE_PROVIDERS = [getEnvRanges, getSectionRanges];

export class LaTeXFoldingRangeProvider implements FoldingRangeProvider {
	provideFoldingRanges(doc: TextDocument): FoldingRange[] {
		return RANGE_PROVIDERS.flatMap((getRanges) => getRanges(doc, doc.getText()));
	}
}
