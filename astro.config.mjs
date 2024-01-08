import {defineConfig} from 'astro/config';
import {sanityIntegration} from "@sanity/astro";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanityIntegration({
      projectId: 'aemgaomh',
      dataset: 'production',
      apiVersion: '2022-03-07',
      useCdn: false
    }),
    react(),
    tailwind()],
  image: {
    domains: ["cdn.sanity.io"],
    remotePatterns: [{ protocol: "https"}]
  },
  prefetch: true
});
