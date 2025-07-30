import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    use: {
        baseURL: 'http://localhost:3000',
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
    webServer: {
        command: 'npm run dev & sleep 3',
        port: 0,
    }
});
