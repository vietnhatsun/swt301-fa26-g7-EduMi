import { By } from 'selenium-webdriver';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = By.css("[data-testid='login-email']");
  private readonly passwordInput = By.css("[data-testid='login-password']");
  private readonly submitButton = By.css("[data-testid='login-submit']");
  private readonly errorMessage = By.css("[data-testid='login-error']");

  async openPage(): Promise<this> {
    await this.open('/login');
    await this.waitVisible(this.emailInput);
    return this;
  }

  async login(email: string, password: string): Promise<void> {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  isErrorDisplayed(): Promise<boolean> {
    return this.isDisplayed(this.errorMessage);
  }

  getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}

