import { z } from 'astro/zod';
import defineTheme from "astro-theme-provider";
import minecraftStyles from "./unocss";
import mdx from "@astrojs/mdx";

export const minecraftTheme = defineTheme({
	name: "astrocraft",
	schema: z.object({}),
	integrations: [mdx(), minecraftStyles()],
	imports: {
		styles: [
			'./src/styles/reset.css',
			'./src/styles/minecraft.css'
		]
	}
});

export { minecraftTheme as default }
