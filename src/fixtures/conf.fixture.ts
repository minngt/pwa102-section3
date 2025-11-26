import { test as base } from '@playwright/test';
import { loadMergedConfig } from '../utils/conf';

// type Config = any;

/**
 * Playwright fixture: conf
 * Loads and merges config for each test based on test file, caseId, and env.
 * Usage: test('desc', async ({ conf }) => { ... })
 */
export const test = base.extend<{ conf: any }>({
  conf: async ({ }, use: any, testInfo: any) => {
    // Get test file path
    const testFilePath = testInfo.file;
    // Get caseId from test title or custom annotation (modify as needed)
    // Example: test.describe('AUTH_001', ...) or test('AUTH_001', ...)
    // We'll try to extract a case ID like 'AUTH_001' from testInfo.title
    let caseId = testInfo?.tags?.[0];
    if (!caseId) {
      throw new Error('Cannot determine caseId from test title: ' + testInfo.title);
    }

    // Remove @
    caseId = caseId.replace('@', '');
    // Get env from process.env or default to 'dev'
    const env = process.env.ENV || 'dev';
    // Load merged config
    const conf = loadMergedConfig(testFilePath, caseId, env);
    await use(conf);
  },
});


export { expect } from "@playwright/test";