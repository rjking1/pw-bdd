import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.features-gen', // <- generated BDD tests
  // projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
