import { defineConfig } from "astro/config";
import minecraftTheme from "astrocraft";

export default defineConfig({
	integrations: [
		minecraftTheme(),
	],
});
