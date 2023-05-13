import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { World } from 'playwright-bdd';

Given('I open url {string}', async function (this: World, url: string) {
  await this.page.goto(url);
  // if cookie banner exists, close it
  const cookieButton = await this.page.getByRole('button', { name: 'Accept all cookies' });
  if (cookieButton) {
    await cookieButton.click();
  }
});

When('I click link {string}', async function (this: World, name: string) {
  await this.page.getByRole('link', { name }).click();
});

Then('I see in title {string}', async function (this: World, keyword: string) {
  await expect(this.page).toHaveTitle(new RegExp(keyword));
});  

Given('we open {string} using {string}', async function (a, b){
  console.info(a,b)
});

When("I search for {string}", async function (this: World, town: string) {
  const srch = await this.page.locator("#search-box-input");
  await srch.click();
  await srch.fill(town);
  // await this.page.waitForTimeout(1000); // #1
  // await this.page.getByRole('option', { name: new RegExp(town) }).first().waitFor(); // #2a
  // await srch.press('Enter'); // #2b
  await this.page.getByRole('option', { name: new RegExp(town) }).first().click(); // #3
  // wait for list of incidents
  await this.page.waitForTimeout(1000);
  //  waiting for map to draw...
  await this.page.waitForTimeout(1000);
  await this.page.waitForTimeout(1000);
  await this.page.waitForTimeout(1000);
  await this.page.waitForTimeout(1000);
  await this.page.waitForTimeout(1000);
})