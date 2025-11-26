import { Page } from "@playwright/test"

export class BasePage {
    page: Page
    baseUrl: string;

    constructor(page: Page) {
        this.page = page
        this.baseUrl = process.env.BASE_URL as string;
    }

    locator(locator: string) {
        return this.page.locator(locator)
    }
}