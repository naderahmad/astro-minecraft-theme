import type { AstroIntegration } from 'astro';
import { AstrocraftConfigSchema } from './schemas';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import defineTheme from 'astro-theme-provider';

const tailwindConfigPath = fileURLToPath(new URL('./tailwind.config.ts', import.meta.url))

const AstroCraftProvider = defineTheme({
  schema: AstrocraftConfigSchema
})

export default function AstroCraft(opts: Parameters<typeof AstroCraftProvider>[0]) : AstroIntegration[] {
  return [
    AstroCraftProvider(opts),
    tailwind({ configFile: tailwindConfigPath, applyBaseStyles: false }),
    mdx()
  ]
}