// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["pl", "en"],
    defaultLocale: "pl",
  },
  experimental: {
      svg: true,
    },
});