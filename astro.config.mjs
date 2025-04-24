// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

import decapCmsOauth from "astro-decap-cms-oauth";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["pl", "en"],
    defaultLocale: "pl",
  },

  // adapter: cloudflare(),
  experimental: {
      svg: true,
      session: true,
    },
  // output: 'server',
  adapter: cloudflare(),
  integrations: [decapCmsOauth()],
});