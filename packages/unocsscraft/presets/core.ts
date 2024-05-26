import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { type Preset, definePreset } from "unocss";

interface PresetCoreOptions {
	blockSize?: number;
}

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);

export const presetMCCore = definePreset((options: PresetCoreOptions = {}): Preset => {
	const { blockSize = 3 } = options;

	return {
		name: "astrocraft-core",
		theme: {
			minecraft: {
				size: {
					block: `${blockSize}rem`,
				},
				color: {
					//  Website/Typography colors
					"text": "#e0d0d0",
					"text-accent": "#aaaaff",
					"text-active": "#fef08a",

					// Chat colors
					"minecraft-purple-light": "#FF55FF",
					"minecraft-blue-dark": "#0000AA",
					"minecraft-green-dark": "#00AA00",
					"minecraft-aqua-dark": "#00AAAA",
					"minecraft-red-dark": "#AA0000",
					"minecraft-purple-dark": "#AA00AA",
					"minecraft-gray-dark": "#555555",
					"minecraft-gold": "#FFAA00",
					"minecraft-blue": "#5555FF",
					"minecraft-green": "#55FF55",
					"minecraft-aqua": "#55FFFF",
					"minecraft-red": "#FF5555",
					"minecraft-yellow": "#FFFF55",

					// Wool colors
					"wool-blue-light": "#6699D8",
					"wool-gray-light": "#999999",
					"wool-orange": "#D87F33",
					"wool-magenta": "#B24CD8",
					"wool-yellow": "#E5E533",
					"wool-lime": "#7FCC19",
					"wool-pink": "#F27FA5",
					"wool-gray": "#4C4C4C",
					"wool-cyan": "#4C7F99",
					"wool-purple": "#7F3FB2",
					"wool-blue": "#334CB2",
					"wool-brown": "#664C33",
					"wool-green": "#667F33",
					"wool-red": "#993333",
					"wool-black": "#191919",

					// // Steve colors
					// 'steve-shirt': '#00a8a8',
					// 'steve-pants': '#463aa5',

					// // Grass colors
					// 'grass': '#79C05A',
					// 'grass-jungle': '#59C93C',
					// 'grass-plains': '#91BD59',
					// 'grass-forest': '#79C05A',
					// 'grass-ocean': '#8EB971',
					// 'grass-meadow': '#83BB6D',
					// 'grass-tiaga': '#86B783',
					// 'grass-snowy': '#80B497',
					// 'grass-swamp': '#6A7039',
					// 'grass-badlands': '#90814D',
					// 'grass-desert': '#BFB755',

					// //  Foilage colors
					// 'foilage': '#59AE30',
					// 'foilage-forest': '#59AE30',
					// 'foilage-meadow': '#63A948',
					// 'foilage-jungle': '#30BB0B',
					// 'foilage-tiaga': '#68A464',
					// 'foilage-desert': '#AEA42A',
					// 'foilage-plains': '#77AB2F',
					// 'foilage-badlands': '#9E814D',
					// 'foilage-swamp': '#6A7039',
					// 'foilage-snowy': '#60A17B',

					// // Water colors
					// 'water': '#44AFF5',
					// 'water-forest': '#1E97F2',
					// 'water-meadow': '#0E4ECF',
					// 'water-river': '#0084FF',
					// 'water-mountain': '#007BF7',
					// 'water-beach': '#157CAB',
					// 'water-jungle': '#14A2C5',
					// 'water-tiaga': '#287082',
					// 'water-savanna': '#2C8B9C',
					// 'water-desert': '#32A598',
					// 'water-badlands': '#4E7F81',
					// 'water-swamp': '#4C6559',
					// 'water-mushroom': '#8A8997',
					// 'water-end': '#62529E',
					// 'water-nether': '#905957',
				},
			},
		},
		preflights: [
			{
				getCSS: ({ theme }) => `
          :root {
            ${
							// Create CSS variables from MC theme object
							Object.entries(theme.minecraft)
								.map(([type, values]) =>
									Object.entries(values)
										.map(([name, value]) => `--${type}-${name}: ${value};`)
										.join("\n"),
								)
								.join("\n")
						}
          }

          * {
            image-rendering: auto;
          }
        `,
			},
		],
	};
});
