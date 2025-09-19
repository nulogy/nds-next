import sax from "sax";

interface SvgParseResult {
	viewBox: string;
	path: string[];
}

interface SvgParserState {
	viewBox: string;
	paths: string[];
	currentPath: string | null;
}

function parseSvg(svg: string): SvgParseResult {
	const parser = sax.parser(true, {
		lowercase: true,
		trim: true,
		normalize: true,
	});

	const state: SvgParserState = {
		viewBox: "",
		paths: [],
		currentPath: null,
	};

	parser.onopentag = (node: sax.Tag) => {
		if (node.name === "svg") {
			// Extract viewBox from SVG element
			state.viewBox =
				// biome-ignore lint/complexity/useLiteralKeys: results in typescript error
				node.attributes["viewbox"] || node.attributes["viewBox"] || "";
		} else if (node.name === "path") {
			// Extract path data and check if it's not a transparent path
			// biome-ignore lint/complexity/useLiteralKeys: results in typescript error
			const pathData = node.attributes["d"];
			// biome-ignore lint/complexity/useLiteralKeys: results in typescript error
			const fill = node.attributes["fill"];

			if (pathData && fill !== "none") {
				state.paths.push(pathData);
			}
		}
	};

	parser.onerror = (err: Error) => {
		throw new Error(`SVG parsing error: ${err.message}`);
	};

	parser.write(svg).close();

	return {
		viewBox: state.viewBox,
		path: state.paths,
	};
}

export default parseSvg;
