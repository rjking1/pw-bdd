import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['features/*.feature'],
  require: ['features/steps/*.ts'],
  requireModule: ['ts-node/register'],
});

// export default defineConfig({
//   testDir: '.features-gen', // <- generated BDD tests
//   // projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         ...devices['Desktop Chrome'],
//       },
//     },
//     {
//       name: 'Mobile Safari',
//       use: {
//         ...devices['iPhone 13'],
//       },
//     },
//   ],
//   // reporter: 'html',
// });

export default defineConfig({
  testDir,
  reporter: 'html',
    projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 13'],
    //   },
    // },
  ],
});


