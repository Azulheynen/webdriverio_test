import { browser, expect } from "@wdio/globals";
import registerPage from "../test/pages/register.page";
import userData from "../data-dummy/userData.json";

describe("lambda test for register user", () => {
  before("visit url", async () => {
    await browser.url(
      "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
    );
  });

  it("user registry", async () => {
    await registerPage.accessRegisterPage();

    userData.forEach(async (data) => {
      await registerPage.registerUser(
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.confirm_password
      );
      console.log("i did it");
    });
  });
});
