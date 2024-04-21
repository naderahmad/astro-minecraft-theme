declare module 'astrocraft/context' {
  const Config: import('astro').AstroConfig;
	export default Config;
}

declare module 'astrocraft/config' {
  const Config: import('./types').AstrocraftUserConfig;
  export default Config;
}

declare module 'astrocraft/components' {
	export const Layout: typeof import('./layouts/Layout.astro').default;
	export const Navbar: typeof import('./components/Navbar.astro').default;
  export const Footer: typeof import('./components/Footer.astro').default;
}

declare module 'astrocraft/assets' {
  type ImageMetadata = import('astro').ImageMetadata;
  export const logo: ImageMetadata;
  export const blocks: Record<string, ImageMetadata>;
  export const items: Record<string, ImageMetadata>;
  export const paintings: Record<string, ImageMetadata>;
  export const icons: Record<string, ImageMetadata>;
  export const gui: Record<string, ImageMetadata>;
}

declare module 'astrocraft/css' {}