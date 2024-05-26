import type { AstroIntegration } from "astro";
import { fileURLToPath } from 'node:url';
import { dirname, extname, isAbsolute, resolve } from 'node:path';
import { addIntegration, hasIntegration } from "astro-integration-kit";
import { presetWind } from "unocss";
import unoCSS from "unocss/astro";
import { presetMCCore, presetMCGUI, presetMCTypography, presetMCUtilities } from "unocsscraft";
import { existsSync } from "node:fs";
import { AstroError } from "astro/errors";

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

interface Options extends Prettify<NonNullable<Parameters<typeof unoCSS>[0]>> {
	assetDir?: string;
	inlineFonts?: boolean;
	tailwindPreset?: boolean;
}

export default function (options: Options = {}): AstroIntegration {
	const {
		assetDir = "./",
		inlineFonts = false,
		tailwindPreset = true,
		...optionsUnoCSS
	} = options;

	return {
		name: "astrocraft",
		hooks: {
			"astro:config:setup": (params) => {
				if (!inlineFonts) {
					params.injectScript('page-ssr', `import "unocsscraft/fonts";`)
				}

				const presets = [
					presetMCCore(),
					presetMCTypography({ inlineFonts }),
					presetMCGUI(),
					presetMCUtilities({ assetDir: resolveDirectory(params.config.root, assetDir) }),
				]

				if (tailwindPreset) {
					presets.push(presetWind())
				}

				optionsUnoCSS.presets ||= []
				optionsUnoCSS.presets.push(...presets)

				const integration = unoCSS(optionsUnoCSS);

				if (hasIntegration(params, { name: integration.name })) {
					throw new Error(`UnoCSS integration already exists, manually add the preset to your configuration`);
				}

				addIntegration(params, { integration });
			},
		},
	};
}

export function resolveDirectory(base: string | URL, path: string | URL): string {
	if (path instanceof URL || path.startsWith("file:/")) {
		path = fileURLToPath(path);
	}

	if (!isAbsolute(path)) {
		path = resolve(resolveDirectory("./", base), path);
	}

	if (extname(path)) {
		path = dirname(path);
	}

	if (!existsSync(path)) {
		throw new AstroError("Tried to resolve directory that does not exist!", `"${path}"`);
	}

	return path;
}
