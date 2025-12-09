import { expect, test } from '@playwright/test'

test.describe('Simple suite to test report', async () => {
    test("Simple suite - 01", async ({ page }) => {
        await test.step("Step 1: Go to login site", async () => {
            await page.goto("https://e-commerce-dev.betterbytesvn.com/wp-login.php");

            // expect điều kiện trang load xong
            const usernameInput = page.locator("//input[@id='user_login']");
            await expect(usernameInput).toBeFocused();
        });

        await test.step("Step 2: Input username and password", async () => {
            const usernameInput = page.locator("//input[@id='user_login']");
            const passwordInput = page.locator("//input[@id='user_pass']");
            const loginButton = page.locator("//input[@id='wp-submit']");

            await usernameInput.fill(process.env.SITE_USERNAME || 'undefined');
            await passwordInput.fill(process.env.SITE_PASSWORD || 'undefined');
            await loginButton.click();

            // Expect
        });
    });

    test.skip("Simple suite - skip case", async ({ page }) => {
        
    });

    test("Simple suite - error case", async ({ page }) => {
        expect(1).toEqual(2);
    });

});
