import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks against a running site.
 * Local: start the app (`pnpm dev` or `pnpm build && pnpm start`) and run
 *   BASE_URL=http://localhost:3000 pnpm test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
