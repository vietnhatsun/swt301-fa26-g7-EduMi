import { By } from 'selenium-webdriver';
import { BasePage } from '../base/BasePage';

export class HomePage extends BasePage {
  private readonly brandLogo = By.css("a[href='/']");

  async openPage(): Promise<this> {
    await this.open('/');
    return this;
  }

  async getTitle(): Promise<string> {
    return this.driver.getTitle();
  }
}

