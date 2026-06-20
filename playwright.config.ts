import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    // Base URL of the Next.js app during tests
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retry-with-video',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
