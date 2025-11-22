import { LoginPage } from "@pages/dashboard/authentication/login.page";
import { DashboardPage } from "@pages/dashboard/dashboard-base.page";
import { test, expect } from "@playwright/test"

test.describe("Login", async () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let username: string, password: string;

    test('Login successfully', async ({ page }) => {

        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        username = process.env.USERNAME as string;
        password = process.env.PASSWORD as string;

        await test.step('Navigate to Login page', async () => {
            loginPage.navigateToLoginPage();
            await expect(page.locator(loginPage.usernameLocator)).toBeVisible();
            await expect(page.locator(loginPage.passwordLocator)).toBeVisible();
            await expect(page.locator(loginPage.loginButtonLocator)).toBeEnabled();
        })

        await test.step('Verify Login successfully', async () => {
            loginPage.login(username, password);
            await expect(dashboardPage.verifyDashboardPresence).toBeTruthy();
            await expect(dashboardPage.verifyDashboardActivity).toBeTruthy();
            await expect(dashboardPage.verifyDashboardAtAGlance).toBeTruthy();
            await expect(dashboardPage.verifyDashboardNewsletter).toBeTruthy();
            await expect(dashboardPage.verifyDashboardSiteHealthStatus).toBeTruthy();
            await expect(page).toHaveURL(`${loginPage.dashboardPath}/`);
        })
    })
})