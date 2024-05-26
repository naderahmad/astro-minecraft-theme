import mdx from "@astrojs/mdx";
import defineTheme from "astro-theme-provider";
import { z } from "astro/zod";
import minecraftStyles from "./unocss";

export const minecraftTheme = defineTheme({
	name: "astrocraft",
	schema: z.object({}),
	integrations: [mdx(), minecraftStyles()],
	imports: {
		styles: ["./src/styles/reset.css", "./src/styles/minecraft.css"],
	},
});

export { minecraftTheme as default };
