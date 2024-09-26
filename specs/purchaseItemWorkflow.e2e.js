import { browser } from "@wdio/globals";
import { expect } from "expect-webdriverio";

describe("Amazon website Home Page", () => {
  before("Access and verify url and title", async () => {
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
    await searchAndDelete(products);
  });

  it("Search text and autosuggestion matches", async () => {
    await browser.url("/");
    const searchInput = await $("#twotabsearchtextbox");
    searchInput.addValue("mushroom");
    const suggestionBox = await $(".s-suggestion-container:first-child");
    const text = await suggestionBox.getText();
    await expect(suggestionBox).toBeDisplayed();
    await expect(text).toContain("mushroom");
  });

  it("click on search shows autosuggestion  and search matches", async () => {
    await browser.url("/");

    //search for item and click on the first one
    const searchInput = await $("#twotabsearchtextbox");
    const productItem = searchInput.addValue("plush");
    const searchButton = await $("#nav-search-submit-button");
    await searchButton.click();
    const item = await $(".s-product-image-container:nth-child(2)");
    await item.click();

    // check that title contains the search
    const productTitle = await $("#productTitle").getText();
    console.log(productTitle);
    const wordToSearch = productItem;
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
    //delete item from cart
    const goToCartButton = await $('[href="/gp/cart/view.html?ref_=nav_cart"]');
    await goToCartButton.click();

    const deleteButton = await $('[value="Delete"]');
    await deleteButton.click();

    const emptyCart = await $(".sc-cart-header .a-row h2");
    await expect(emptyCart).toHaveText("Your Amazon Cart is empty.");
  });

  it("change quantity of the same item in cart and quantity and price adds up", async () => {
    await browser.url("/");
    //search item
    const searchInput = await $("#twotabsearchtextbox");
    searchInput.addValue("plushie");
    const searchButton = await $("#nav-search-submit-button");
    await searchButton.click();
    const Item = await $(".s-product-image-container:nth-child(2)");
    await Item.click();

    //add to cart
    const addToCartButton = await $("#add-to-cart-button");
    addToCartButton.click();

    //price of 1 item
    const price = await $(".ewc-subtotal-amount").getText();
    const priceText = price.trim();
    const priceNumber = Number(price.replace(/[^0-9.-]+/g, ""));

    //go to cart
    const goToCartButton = await $('[href="/cart?ref_=sw_gtc"]');
    goToCartButton.click();

    //check correct quantity of items
    const subtotalOfItem = await $("#sc-subtotal-label-activecart");
    subtotalOfItem.getText();
    await expect(subtotalOfItem).toHaveText("Subtotal (1 item):");

    //subtotal price for 1 item
    const subtotal = await $("#sc-subtotal-amount-activecart").getText();
    await expect(subtotal).toEqual(" " + priceText);

    // add one more of the same item
    const addMoreDropdown = await $(".sc-action-quantity");
    await addMoreDropdown.click();

    const dropdownQuantityOfItems = await $("#quantity_2");
    await dropdownQuantityOfItems.click();

    //expect change in quantity and price, item 1 * 2
    const subtotalOfItems = await $("#sc-subtotal-label-buybox");
    await subtotalOfItems.getText();
    await expect(subtotalOfItems).toHaveText("Subtotal (2 items):");

    const priceForTwoitems = priceNumber * 2;

    const subtotalForTwoItems = await $(
      '//span[contains(@class, "a-size-medium") and contains(@class, "a-color-base") and contains(@class, "sc-price") and contains(@class, "sc-white-space-nowrap")]'
    ).getText();
    const subtotalForTwoItemsNumber = Number(
      subtotalForTwoItems.replace(/[^0-9.-]+/g, "")
    );
    await expect(subtotalForTwoItemsNumber).toEqual(priceForTwoitems);
  });
});
