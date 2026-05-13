const { chromium } = require('playwright');

(async () => {
    console.log('Starting browser test...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Log all console messages
    page.on('console', msg => console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text()));

    // Log failed network requests
    page.on('response', response => {
        if (!response.ok()) {
            console.log(`Failed Request: ${response.url()} - Status: ${response.status()}`);
        }
    });

    try {
        console.log('Navigating to login...');
        await page.goto('http://localhost:3001/login');

        console.log('Filling login...');
        await page.fill('input[type="email"]', 'admin@cleancar.com');
        await page.fill('input[type="password"]', 'admin123'); // Assuming standard admin pass or it will log error
        await page.click('button[type="submit"]');

        console.log('Waiting for login to complete...');
        await page.waitForTimeout(2000); // Wait for redirect

        console.log('Navigating to Novo Funcionario directly...');
        await page.goto('http://localhost:3001/funcionarios/novo');

        console.log('Filling employee name...');
        await page.fill('input[type="text"]', 'Playwright Test Employee');

        console.log('Submitting form...');
        await Promise.all([
            page.waitForResponse(resp => resp.url().includes('funcionarios') && resp.request().method() === 'POST'),
            page.click('button[type="submit"]')
        ]).then(([response]) => {
            console.log(`Employee creation response status: ${response.status()}`);
        }).catch(e => {
            console.log('Timeout waiting for employee creation response');
        });

        await page.waitForTimeout(2000); // Give time for any deferred errors

    } catch (e) {
        console.error('Test script error:', e);
    } finally {
        await browser.close();
        console.log('Test complete.');
    }
})();
