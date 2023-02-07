describe('New user', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
        camera: 'YES',
      },
    })
  })

  // beforeEach(async () => {
  //   await device.reloadReactNative()
  // })

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible()
  })

  it('should go through carousel', async () => {
    await expect(element(by.id('welcome-screen-0'))).toBeVisible()
    await device.takeScreenshot('welcome-screen-0')

    await element(by.id('welcome-next')).tap()
    await expect(element(by.id('welcome-screen-1'))).toBeVisible()
    await device.takeScreenshot('welcome-screen-1')

    await element(by.id('welcome-next')).tap()
    await expect(element(by.id('welcome-screen-2'))).toBeVisible()
    await device.takeScreenshot('welcome-screen-2')

    await element(by.id('welcome-next')).tap()
    await expect(element(by.id('welcome-newUser'))).toBeVisible()
    await device.takeScreenshot('welcome-newUser')
    
    await expect(element(by.id('welcome-next'))).not.toBeVisible()
  })

  it('allows to skip screens', async () => {
    await element(by.id('welcome-skipFoward')).tap()
    await expect(element(by.id('welcome-newUser'))).toBeVisible()
  })

  it('should redirect to buy screen after user creation', async () => {
    await element(by.id('welcome-skipFoward')).tap()
    await element(by.id('newUser-register')).tap()
    await waitFor(element(by.id('view-buy'))).toBeVisible()
    await expect(element(by.id('view-buy'))).toBeVisible()
  })
})
