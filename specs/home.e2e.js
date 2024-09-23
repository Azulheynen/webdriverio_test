import { browser } from "@wdio/globals";
import { expect } from "expect-webdriverio";

describe("Home page", () => {
  beforeEach("Access and verify url and title", async () => {
    await browser.url("/");
    await expect(browser).toHaveUrl("https://www.amazon.com/");
    await expect(browser).toHaveTitle("Amazon.com");
  });

  it("Search Content and Verify Text", async () => {
    const products = [
      "otter stuffed animal",
      "mushroom lamp",
      "cat cup",
      "puppy cap",
    ];

    const searchAndDelete = async (products, target) => {
      const searchInput = await $("#twotabsearchtextbox");
      const searchButton = await $("#nav-search-submit-button");

      for (let i = 0; i < products.length; i++) {
        await searchInput.clearValue();
        await searchInput.addValue(products[i]);
        await searchButton.click();

        const searchedElement = await $(".a-color-state");
        const searchedText = await searchedElement.getText();

        const addComillas = (text) => `"${text}"`;
        await expect(searchedText).toEqual(addComillas(products[i]));

        if (products[i] === target) {
          console.log(`Deleting product: ${products[i]}`);
          products.splice(i, 1);
          i--;
        }
      }
    };
    await searchAndDelete(products, "cat cup");
  });

  it("Search text and autosugestion matches", async () => {
    const searchInput = await $("#twotabsearchtextbox");
    searchInput.addValue("mushroom cup");
    const suggestionBox = await $(".s-suggestion-container:first-child");
    const text = await suggestionBox.getText();
    await expect(suggestionBox).toBeDisplayed();
    await expect(text).toContain("mushroom cup");
  });

  it.only("click on search shows autosugestion  and search matches", async () => {
    //search for item and click on the first one
    const searchInput = await $("#twotabsearchtextbox");
    searchInput.addValue("plushie");
    const searchButton = await $("#nav-search-submit-button");
    await searchButton.click();
    const firstItem = await $(".s-product-image-container");
    await firstItem.click();
    // check that title contains the search
    const productTitle = await $("#productTitle").getText();
    const wordToSearch = "plushie";
    const regex = new RegExp(`\\b${wordToSearch}\\b`, "i");
    const isWordPresent = regex.test(productTitle);
    await expect(isWordPresent).toBe(true);
    //see price
    const price = await $(
      "#corePriceDisplay_desktop_feature_div .a-price"
    ).getText();
    //add to cart & that price matches
    const addToCartButton = await $("#add-to-cart-button");
    addToCartButton.click();
    //see that item matchs
    const confirmation = await $("#sw-atc-confirmation").getText();
    const subTotal = await $("#sw-subtotal").getText();
    await expect(confirmation).toContain("Added to Cart");
    await expect(subTotal).toContain(price);
    //checkout
    const proceedButton = await $("input[name=proceedToRetailCheckout]");
    proceedButton.click();
  });
});
