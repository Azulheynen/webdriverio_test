import { browser } from "@wdio/globals";
import { expect } from "expect-webdriverio";
import LoginPage from "../test/pages/login.page";

describe("login page", () => {
  before(async () => {
    const baseUrl = await browser.url(
      "https://the-internet.herokuapp.com/login"
    );
    await expect(browser).toHaveUrl("https://the-internet.herokuapp.com/login");
  });

  it("user login", async () => {
    await browser.url("https://the-internet.herokuapp.com/login");
    const title = await $(".example h2");
    await expect(title).toHaveText("Login Page");

    const usernameTest = await LoginPage.username;
    const passwordTest = await LoginPage.password;

    await LoginPage.login(usernameTest, passwordTest);
    await LoginPage.getSuccessMessage("Secure Area");

    await LoginPage.logoutButton.click();
    //Im usin Page Object Models  and the class is stored in test/pages/login
  });

  it("user login with wrong credentials", async () => {
    await LoginPage.loginWithWrongCredentials();
    await LoginPage.errorBannerElement.waitForDisplayed();
    await LoginPage.getErrorMessage("Your username is invalid!");
  });
});
