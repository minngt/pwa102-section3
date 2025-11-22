import { Page } from "@playwright/test";
import { BasePage } from "../base.page";

export class DashboardPage extends BasePage {

    readonly dashboardPath = 'wp-admin'
    readonly dashboardHeading = '//h1[contains(text(), "Dashboard")]';

    constructor(page: Page) {
        super(page)
    }

    async gotoDashboard() {
        this.page.goto(this.dashboardPath)
    }

    async verifyDashboardPresence() {
        return this.page.locator(this.dashboardHeading).isVisible();
    }

    async verifyDashboardActivity() {
        return this.page.locator('//h2[normalize-space()="Activity"]').isVisible();
    }

    async verifyDashboardAtAGlance() {
        return this.page.locator('//h2[normalize-space()="At A Glance"]').isVisible();
    }

    async verifyDashboardNewsletter() {
        return this.page.locator('//h2[normalize-space()="Newsletter"]').isVisible();
    }

    async verifyDashboardSiteHealthStatus() {
        return this.page.locator('//h2[normalize-space()="Site Health Status"]').isVisible();
    }

    async logout() {
        await this.page.locator('#wp-admin-bar-my-account').hover();
        await this.page.locator('#wp-admin-bar-logout').click();
    }

}