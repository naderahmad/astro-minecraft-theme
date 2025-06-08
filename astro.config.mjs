import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site:  'https://naderahmad.github.io/astro-minecraft-theme/',
  base:  '/astro-minecraft-theme/',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});