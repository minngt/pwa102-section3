import { Page } from "@playwright/test"
import { DashboardPage } from "../dashboard-base.page";

export class LoginPage extends DashboardPage {

    readonly usernameLocator = '//input[@id="user_login"]';
    readonly passwordLocator = '#user_pass';
    readonly loginButtonLocator = '#wp-submit';
    readonly errorMessageLocator = '#login_error';

    constructor(page: Page) {
        super(page)
    }

    async navigateToLoginPage() {
        await this.page.goto(`${this.baseUrl}/${this.dashboardPath}`)
    }

    async login(username: string, password: string) {
        await this.page.locator(this.usernameLocator).fill(username);
        await this.page.locator(this.passwordLocator).fill(password);
        await this.page.locator(this.loginButtonLocator).click();
    }

}