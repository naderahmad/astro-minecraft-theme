import { readFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { type Preset, definePreset, toEscapedSelector } from "unocss";

interface PresetCoreOptions {
	inlineFonts?: boolean;
}

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);

function capitalize(string = "") {
	return (string[0] || "").toUpperCase() + string.slice(1);
}

function unsnake(string: string) {
	return string.split("-").map(capitalize).join(" ");
}

export const presetMCTypography = definePreset((options: PresetCoreOptions = {}): Preset => {
	const { inlineFonts = true } = options;

	const fontFaces = new Map();
	const fontFiles = fg.sync(["*.woff2"], {
		cwd: resolve(thisDir, "../assets/fonts"),
		absolute: true,
	});

	for (const filepath of fontFiles) {
		const filename = basename(filepath).slice(0, -extname(filepath).length);
		const [fontname, weight, style] = filename.split("_");
		if (!(weight || style)) {
			fontFaces.set(fontname, "");
		}
		if (inlineFonts) {
			fontFaces.set(fontname, inlineFontFace(filepath) + (fontFaces.get(fontname) || ""));
		}
	}

	return {
		name: "astrocraft-typography",
		rules: [
			[
				/^font-([^\s]+)$/,
				([_, name], { rawSelector }) => {
					if (!name) return;
					if (!fontFaces.has(name)) return;
					const fontface = fontFaces.get(name) || "";
					const selector = toEscapedSelector(rawSelector);
					return `
          ${selector} {
            font-family: ${unsnake(name)};
          }
          ${fontface}
        `;
				},
			],
			[
				/^minecraft-prose$/,
				(_, { rawSelector }) => {
					const selector = toEscapedSelector(rawSelector);
					return `
          ${selector} {

          }
        `;
				},
			],
		],
	};
});

function inlineFontFace(filepath: string) {
	const base64 = readFileSync(filepath).toString("base64");
	const filename = basename(filepath).slice(0, -extname(filepath).length);
	const [name, weight, style] = filename.split("_");
	return `
    @font-face {
      font-family: '${unsnake(name!)}';
      src: url(data:font/woff2;base64,${base64}) format('woff2');
      font-weight: ${weight || "normal"};
      font-style: ${style || "normal"};
      font-display: swap;
    }
  `;
}
