import { LoginPage } from "@pages/dashboard/authentication/login.page";
import { DashboardPage } from "@pages/dashboard/dashboard-base.page";
import { expect } from "@playwright/test"
import { test } from '@fixtures/conf.fixture'


test.describe("Login", async () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let username: string, password: string;

    test('Login successfully', {
        annotation: {
            type: 'MODULE_ID',
            description: 'AUTH'
        },
        tag: ['@LOGIN_001', '@LOGIN']
    }
        , async ({ page, conf }) => {

            loginPage = new LoginPage(page);
            dashboardPage = new DashboardPage(page);
            console.log(conf.username)
            username = conf.username;
            password = process.env.PASSWORD || '';

            await test.step('Navigate to Login page', async () => {

                const locs = Object.fromEntries(
                    Object.entries(loginPage.loginLocs).map(([key, selector]) =>
                        [key, loginPage.locator(selector)]
                    )
                );
                await loginPage.navigateToLoginPage();
                await expect(locs.username).toBeVisible();
                await expect(locs.password).toBeVisible();
                await expect(locs.btnLogin).toBeEnabled();
            })

            await test.step('Verify Login successfully', async () => {
                await loginPage.login(username, password);
                await expect(page).toHaveURL(`${loginPage.dashboardPath}/`);
                await dashboardPage.verifyDashboardPresence();
                await dashboardPage.verifyCollapsibleBlocks()
            })
        })
})