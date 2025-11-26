import { Page, expect } from "@playwright/test";
import { BasePage } from "../base.page";

export const allCollapsibleBlocks = [
    "Activity",
    "At a Glance",
    "WordPress Events and News",
    "Site Health Status"
]

export type CollapsibleBlock = typeof allCollapsibleBlocks[number];

export class DashboardPage extends BasePage {

    readonly dashboardPath = 'wp-admin'

    constructor(page: Page) {
        super(page)
    }

    get dashboardLocs() {
        return {
            heading: '//h1[contains(text(), "Dashboard")]',
            section: (name: CollapsibleBlock) => `//h2[normalize-space()="${name}"]`
        }
    }

    async gotoDashboard() {
        this.page.goto(`/${this.dashboardPath}`)
    }

    async verifyDashboardPresence() {
        await expect(this.locator(this.dashboardLocs.heading)).toBeVisible();
    }

    async verifyCollapsibleBlocks() {
        for (const blockName of allCollapsibleBlocks) {
            await expect(this.locator(this.dashboardLocs.section(blockName))).toBeVisible();
        }
    }
}