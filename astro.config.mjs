// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["pl", "en"],
    defaultLocale: "pl",
  },

  experimental: {
      svg: true,
    },

  adapter: cloudflare(),
});