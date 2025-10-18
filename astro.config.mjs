import {defineConfig} from 'astro/config';
import {sanityIntegration} from "@sanity/astro";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://luhistory.com",
  integrations: [
    sanityIntegration({
      projectId: 'aemgaomh',
      dataset: 'production',
      apiVersion: '2022-03-07',
      useCdn: false
    }),
    react(),
    tailwind(),
    sitemap()],
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [{protocol: "https"}],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  prefetch: true
});
