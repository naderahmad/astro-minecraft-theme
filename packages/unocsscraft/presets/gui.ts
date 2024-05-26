import { readFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { lookup } from "mrmime";
import { type Preset, definePreset, toEscapedSelector } from "unocss";

type PresetGUIOptions = {};

function dataURI(filepath: string) {
	const base64 = readFileSync(filepath).toString("base64");
	const type = lookup(filepath);
	return `url(data:${type};base64,${base64})`;
}

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);

export const presetMCGUI = definePreset((options: PresetGUIOptions = {}): Preset => {
	const {} = options;

	const gui = new Map(
		fg
			.sync([`*.png`], {
				cwd: resolve(thisDir, "../assets/gui"),
				absolute: true,
			})
			.map((path) => [basename(path.slice(0, -extname(path).length)), dataURI(path)]),
	);

	return {
		name: "astrocraft-gui",
		rules: [
			[
				/^minecraft-button$/,
				(_, { theme, rawSelector }) => {
					const selector = toEscapedSelector(rawSelector);
					return `
          ${selector} {
            user-select: none;
            cursor: pointer;
            image-rendering: pixelated;
            background-size: cover;
            background-image: ${gui.get("button-inside")};
            border-width: calc(var(--size-block) / var(--size-gui, 11));
            border-image: ${gui.get("button-border")};
            border-image-width: calc(var(--size-block) / var(--size-gui, 7));
            border-image-slice: 16% 5%;
            border-image-repeat: stretch;
            white-space: nowrap;
            text-decoration: none;
            text-shadow: 1.5px 1.5px #000;
            color: #d1d5db;
          }
        
          ${selector}:hover {
            background-image: ${gui.get("button-inside-hover")};
            border-image: ${gui.get("button-border-hover")};
            border-image-width: calc(var(--size-block) / var(--size-gui, 7));
            border-image-slice: 16% 5%;
            border-image-repeat: stretch;
            text-decoration: none;
            color: ${theme.minecraft.color["text-active"]};
          }
        
          ${selector}:active {
            background-image: ${gui.get("button-inside-active")};
            border-image: ${gui.get("button-border-active")};
            border-image-width: calc(var(--size-block) / var(--size-gui, 7));
            border-image-slice: 16% 5%;
            border-image-repeat: contain;
            text-decoration: none;
            color: #a8a29e;
          }
        `;
				},
			],
		],
	};
});
