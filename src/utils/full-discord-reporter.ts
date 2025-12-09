import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import * as fs from "fs";
import * as path from "path";

interface TestInfo {
  title: string;
  duration: number;
  status: string;
  tracePath: string | null;
  traceFileName: string | null;
}

class DiscordReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private tests: TestInfo[] = [];
  private discordWebhookUrl: string;

  constructor(options: { webhookUrl: string }) {
    this.discordWebhookUrl = options.webhookUrl;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const duration = result.duration / 1000;

    // Find trace attachment
    const traceAttachment = result.attachments.find(
      (a) => a.name === "trace" && a.path
    );
    const tracePath = traceAttachment?.path || null;

    this.tests.push({
      title: test.title,
      duration: duration,
      status: result.status,
      tracePath: tracePath,
      traceFileName: null, // Will be set during zip
    });

    if (result.status === "passed") {
      this.passed++;
    } else if (result.status === "failed") {
      this.failed++;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    // Copy trace files to report server
    await this.zipReport();

    // Xây dựng và gửi message tới Discord
    await this.sendToDiscord(result);
  }

  private async zipReport(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const reportsDir = path.join(process.cwd(), "report-server/report-html/reports");

    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Copy each test's trace file individually
    for (const test of this.tests) {
      if (test.tracePath && fs.existsSync(test.tracePath)) {
        const safeTitle = test.title.replace(/[^a-zA-Z0-9]/g, "-");
        const traceFileName = `trace_${safeTitle}_${timestamp}.zip`;
        const destPath = path.join(reportsDir, traceFileName);

        fs.copyFileSync(test.tracePath, destPath);
        test.traceFileName = traceFileName;
      }
    }
  }

  private async sendToDiscord(result: FullResult): Promise<void> {
    const total = this.passed + this.failed;
    const passRate = total > 0 ? ((this.passed / total) * 100).toFixed(2) : "0";
    const jobName = process.env.CI_JOB_NAME || "Automation Job";
    const baseUrl = process.env.CI_REPORT_BASE_URL || "";

    const statusText = result.status === "passed" ? "Passed" : "Failed";

    // Build test details with individual trace links
    const testDetails = this.tests
      .map((test) => {
        const icon = test.status === "passed" ? ":white_check_mark:" : ":x:";
        const traceLink = test.traceFileName
          ? ` [[View Trace](https://trace.playwright.dev/?trace=${baseUrl}${test.traceFileName})]`
          : "";
        return `${icon} ${test.title} (${test.duration.toFixed(2)}s)${traceLink}`;
      })
      .join("\n");

    const message = {
      embeds: [
        {
          title: `[${statusText}] Job name: ${jobName}`,
          color: result.status === "passed" ? 0x00ff00 : 0xff0000,
          fields: [
            {
              name: "Summary",
              value: `**Passed:** ${this.passed}/${total} (${passRate}%)`,
              inline: false,
            },
            {
              name: "Test Details",
              value: testDetails || "No tests executed",
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await fetch(this.discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  }
}

export default DiscordReporter;