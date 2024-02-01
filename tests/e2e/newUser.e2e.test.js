describe("New user", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        notifications: "YES",
        camera: "YES",
      },
    });
  });

  it("should see analytics popup", async () => {
    await expect(element(by.id("popup-action1"))).toBeVisible();
  });

  it("analytics popup can be clicked away", async () => {
    await element(by.id("popup-action1")).tap();
    await expect(element(by.id("popup-action1"))).not.toBeVisible();
  });

  it("should have welcome screen", async () => {
    await expect(element(by.id("welcome"))).toBeVisible();
  });

  it("should go through carousel", async () => {
    await expect(element(by.id("welcome-screen-0"))).toBeVisible();
    await device.takeScreenshot("welcome-screen-0");

    await element(by.id("welcome-next")).tap();
    await expect(element(by.id("welcome-screen-1"))).toBeVisible();
    await device.takeScreenshot("welcome-screen-1");

    await element(by.id("welcome-next")).tap();
    await expect(element(by.id("welcome-screen-2"))).toBeVisible();
    await device.takeScreenshot("welcome-screen-2");

    await element(by.id("welcome-next")).tap();
    await expect(element(by.id("welcome-screen-3"))).toBeVisible();
    await device.takeScreenshot("welcome-screen-3");

    await element(by.id("welcome-next")).tap();
    await expect(element(by.id("welcome-newUser"))).toBeVisible();
    await device.takeScreenshot("welcome-newUser");
  });

  it("allows to skip screens", async () => {
    await device.reloadReactNative();
    await element(by.id("welcome-skipFoward")).tap();
    await expect(element(by.id("welcome-newUser"))).toBeVisible();
  });

  it("should redirect to buy screen after user creation", async () => {
    await element(by.id("welcome-newUser")).tap();
    await waitFor(element(by.id("view-buy"))).toBeVisible();
    await expect(element(by.id("view-buy"))).toBeVisible();
  });
});
