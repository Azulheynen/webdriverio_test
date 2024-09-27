import { browser } from "@wdio/globals";

class registerPage {
  get navbar() {
    return $("#widget-navbar-217834");
  }
  get accountButton() {
    return $('//*[@id="widget-navbar-217834"]/ul/li[6]/a');
  }
  get registerButton() {
    return $(
      'div.list-group.mb-3 > a[href="https://ecommerce-playground.lambdatest.io/index.php?route=account/register"]'
    );
  }
  get registerPageTitle() {
    return $("div#content > h1.page-title");
  }
  get usernameTextBox() {
    return $("#input-firstname");
  }
  get lastNameTextBox() {
    return $("#input-lastname");
  }
  get emailTextBox() {
    return $("#input-email");
  }
  get telephoneTextBox() {
    return $("#input-telephone");
  }
  get passwordTextBox() {
    return $("#input-password");
  }
  get passwordConfirmTextBox() {
    return $("#input-confirm");
  }
  get radioButton() {
    return $("label.custom-control-label");
  }

  get agreeButton() {
    const radio = $("div.float-right");
    return radio.$("label[for=input-agree]");
  }
  get continueButton() {
    return $('input[value="Continue"]');
  }

  get succesfullRegisterMessage() {
    return $("div.row > div#content > h1.page-title");
  }
  get continueRegisterButton() {
    return $(
      'a[href="https://ecommerce-playground.lambdatest.io/index.php?route=account/account"]'
    );
  }

  async accessRegisterPage() {
    await this.navbar.waitForDisplayed();

    await this.accountButton.waitForClickable();
    await this.accountButton.click();

    await this.registerButton.waitForClickable();
    await this.registerButton.click();

    await this.registerPageTitle.waitForDisplayed();
    const title = await this.registerPageTitle.getText();

    await expect(title).toEqual("Register Account");
  }

  async registerUser(first_name, last_name, email, phone, password, error_msg) {
    await this.usernameTextBox.addValue(first_name);
    await this.lastNameTextBox.addValue(last_name);
    await this.emailTextBox.addValue(email);
    await this.telephoneTextBox.addValue(phone);
    await this.passwordTextBox.addValue(password);
    await this.passwordConfirmTextBox.addValue(password);
    await this.radioButton.waitForClickable();
    await this.radioButton.click();
    await this.agreeButton.waitForClickable();
    await this.agreeButton.click();
    await this.continueButton.waitForClickable();
    await this.continueButton.click();

    await this.succesfullRegisterMessage.waitForDisplayed();
    const sucess = await this.succesfullRegisterMessage.getText();
    await expect(sucess).toEqual("Your Account Has Been Created!");

    await this.continueRegisterButton.waitForDisplayed();
    await this.continueRegisterButton.click();

    const url = await browser.url(
      "https://ecommerce-playground.lambdatest.io/index.php?route=account/login"
    );
    await expect(url).toContain(
      "https://ecommerce-playground.lambdatest.io/index.php?route=account/login"
    );
  }
}

export default registerPage = new registerPage();
