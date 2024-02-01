export default async () => {
  await element(by.label("Bullet point")).atIndex(4).tap();
  await element(by.id("welcome-newUser")).tap();

  await expect(element(by.id("popup"))).toBeVisible();
  await element(by.id("nda-confirm")).tap();
  await expect(element(by.id("popup"))).not.toBeVisible();

  await element(by.id("newUser-password")).replaceText("strongpassword");
  await element(by.id("newUser-passwordRepeat")).replaceText("strongpassword");
  await element(by.id("newUser-register")).tap();

  await expect(element(by.id("popup"))).toBeVisible();
  await element(by.id("saveYourPassword-confirm")).tap();
  await expect(element(by.id("popup"))).not.toBeVisible();

  await waitFor(element(by.id("view-buy"))).toBeVisible();
};
