import { By, until, type WebDriver, type WebElement } from 'selenium-webdriver';
import { env } from '../config/env';

/**
 * Lớp cơ sở BasePage đại diện cho mọi trang trong mô hình Page Object Model (POM)
 * Tuân thủ quy tắc ISTQB: Chỉ thao tác tương tác và trả dữ liệu, KHÔNG chứa assertion.
 */
export abstract class BasePage {
  constructor(protected readonly driver: WebDriver) {}

  protected async waitVisible(locator: By): Promise<WebElement> {
    const element = await this.driver.wait(until.elementLocated(locator), env.timeoutMs);
    await this.driver.wait(until.elementIsVisible(element), env.timeoutMs);
    return element;
  }

  protected async click(locator: By): Promise<void> {
    const element = await this.waitVisible(locator);
    await this.driver.wait(until.elementIsEnabled(element), env.timeoutMs);
    await element.click();
  }

  protected async type(locator: By, text: string | undefined): Promise<void> {
    const element = await this.waitVisible(locator);
    await element.clear();
    if (text !== undefined && text !== '') {
      await element.sendKeys(text);
    }
  }

  protected async getText(locator: By): Promise<string> {
    return (await this.waitVisible(locator)).getText();
  }

  protected async isDisplayed(locator: By): Promise<boolean> {
    try {
      return await (await this.waitVisible(locator)).isDisplayed();
    } catch {
      return false;
    }
  }

  async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }

  async getTitle(): Promise<string> {
    return this.driver.getTitle();
  }

  async open(path: string): Promise<void> {
    await this.driver.get(`${env.baseUrl}${path}`);
  }
}

