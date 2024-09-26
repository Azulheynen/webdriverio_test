import { expect } from "expect-webdriverio";

class LoginPage {
  get usernameTextbox() {
    return $("#username");
  }

  get passwordTextbox() {
    return $("#password");
  }

  get username() {
    return $(".subheader em");
  }

  get password() {
    return $(".subheader em:nth-child(2)");
  }

  get loginButton() {
    return $("button[type=submit]");
  }
  get logoutButton() {
    return $('a[href = "/logout"]');
  }

  get successMessageElement() {
    return $(".example h2 ");
  }

  get successBannerElement() {
    return $("#flash");
  }
  get errorBannerElement() {
    return $("#flash-messages");
  }

  async login(username, password) {
    const validUsername = await this.username.getText();
    const validPassword = await this.password.getText();
    await this.usernameTextbox.setValue(validUsername);
    await this.passwordTextbox.setValue(validPassword);
    await this.loginButton.click();
  }

  async loginWithWrongCredentials() {
    await this.usernameTextbox.setValue("incorrectUser");
    await this.passwordTextbox.setValue("incorrectPassword");
    await this.loginButton.click();
  }
  async getSuccessMessage(msg) {
    const message = await this.successMessageElement.getText();
    return await expect(message).toEqual(msg);
  }
  async getErrorMessage(msg, errorBannerElement) {
    const message = await this.errorBannerElement.getText();
    return await expect(message.trim()).toContain(msg.trim()); // Assert without leading/trailing spaces
  }
}

export default new LoginPage();
