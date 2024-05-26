import { readFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { lookup } from "mrmime";
import { type Preset, definePreset } from "unocss";

interface PresetUtilityOptions {
	assetDir?: string | undefined;
}

const n = (number: string) => Number(number);

const dataURI = (filepath: string) => {
	const base64 = readFileSync(filepath).toString("base64");
	const type = lookup(filepath);
	return `url(data:${type};base64,${base64})`;
};

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);
const resourcepackDir = resolve(thisDir, "../assets/resourcepacks");

const colorPropertyMap = {
	text: "color",
	bg: "background-color",
	border: "border-color",
	decoration: "text-decoration-color",
	outline: "outline-color",
};

export const presetMCUtilities = definePreset((options: PresetUtilityOptions = {}): Preset => {
	const { assetDir = resourcepackDir } = options;

	const blocks = new Map(
		fg
			.sync([`**/(block|blocks)/**/*.png`], {
				cwd: assetDir,
				absolute: true,
			})
			.map((path) => [basename(path.slice(0, -extname(path).length)), path]),
	);

	const items = new Map(
		fg
			.sync([`**/(item|items)/**/*.png`], { cwd: assetDir, absolute: true })
			.map((path) => [basename(path.slice(0, -extname(path).length)), path]),
	);

	return {
		name: "astrocraft-utils",
		rules: [
			// Variable utils
			[/^zoom-(\d+)$/, ([_, num]) => ({ "--size-gui": num })],
			[
				/^(?:block|item)-size-(\d+)(?:\/(\d+))?$/,
				([_, num, den]) => ({
					"--size-block": `${n(num) / n(den) || num}rem`,
				}),
			],
			// Block spacing
			[
				/^w-block-(\d+)(?:\/(\d+))?$/,
				([_, num, den]) => ({
					width: `calc(${n(num) / n(den) || num} * var(--size-block))`,
				}),
			],
			[
				/^h-block-(\d+)(?:\/(\d+))?$/,
				([_, num, den]) => ({
					height: `calc(${n(num) / n(den) || num} * var(--size-block))`,
				}),
			],
			// Block backgrounds
			[
				/^bg-block-(\w+)$/,
				([_, name]) => {
					const filepath = blocks.get(name!);
					if (!filepath) return;
					return {
						"background-image": dataURI(filepath),
					};
				},
			],
			// Item backgrounds
			[
				/^bg-item-(\w+)$/,
				([_, name]) => {
					const filepath = items.get(name!);
					if (!filepath) return;
					return {
						width: "var(--size-block)",
						height: "var(--size-block)",
						"background-image": dataURI(filepath),
					};
				},
			],
			// Dark block backgrounds
			[
				/bg-light-level-(\d+)/,
				([_, num]) => ({
					"background-color": `rgba(0,0,0,calc(${14 - Math.min(Number(num) || 1, 13)}/13))`,
					"background-blend-mode": "multiply",
				}),
			],
			// Colors
			[
				/^(text|bg|border|decoration|outline)-([^\s]+)$/,
				([_, type, name], { theme }) => {
					if (!theme.minecraft.color[name]) return;
					return {
						[colorPropertyMap[type as keyof typeof colorPropertyMap]]: theme.minecraft.color[name],
					};
				},
			],
		],
		preflights: [
			{
				getCSS: () => `
          [class*="item-"],
          [class*="block-"] {
            image-rendering: pixelated;
            background-repeat: repeat;
            background-size: var(--size-block);
            -o-background-size: var(--size-block);
            -moz-background-size: var(--size-block);
            -webkit-background-size: var(--size-block);
          }
        `,
			},
		],
	};
});
