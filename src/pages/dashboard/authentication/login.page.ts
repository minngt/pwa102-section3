import { Page } from "@playwright/test"
import { DashboardPage } from "../dashboard-base.page";

export class LoginPage extends DashboardPage {

    constructor(page: Page) {
        super(page)
    }

    get loginLocs() {
        return {
            username: '//input[@id="user_login"]',
            password: '#user_pass',
            btnLogin: '#wp-submit',
            errorMsg: '#login_error'
        }
    }

    async navigateToLoginPage() {
        await this.page.goto(`/${this.dashboardPath}`)
    }

    async login(username: string, password: string) {
        const loginLocs = this.loginLocs
        await this.locator(loginLocs.username).fill(username);
        await this.locator(loginLocs.password).fill(password);
        await this.locator(loginLocs.btnLogin).click();
    }

}