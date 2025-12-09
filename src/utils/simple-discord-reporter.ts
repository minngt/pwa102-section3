import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

class SimpleDiscordReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private discordWebhookUrl: string;

  constructor(options: { webhookUrl: string }) {
    this.discordWebhookUrl = options.webhookUrl;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case "passed":
        this.passed++;
        break;
      case "failed":
        this.failed++;
        break;
      case "skipped":
        this.skipped++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const total = this.passed + this.failed + this.skipped;
    const passRate = total > 0 ? ((this.passed / total) * 100).toFixed(2) : 0;
    const statusText = result.status === "passed" ? "Passed" : "Failed";
    const color = result.status === "passed" ? 0x00ff00 : 0xff0000;

    const message = {
      embeds: [
        {
          title: `Test Results: ${statusText}`,
          color: color,
          fields: [
            { name: "Passed", value: `${this.passed}`, inline: true },
            { name: "Failed", value: `${this.failed}`, inline: true },
            { name: "Skipped", value: `${this.skipped}`, inline: true },
            { name: "Pass Rate", value: `${passRate}%`, inline: true },
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

export default SimpleDiscordReporter;