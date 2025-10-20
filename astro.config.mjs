import {defineConfig} from 'astro/config';
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://luhistory.com",
  integrations: [
      sanity({
      projectId: 'aemgaomh',
      dataset: 'production',
      apiVersion: '2022-03-07',
      useCdn: false
    }),
    react(),
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
    vite: {
        plugins: [tailwindcss()],
    },
  prefetch: true
});
