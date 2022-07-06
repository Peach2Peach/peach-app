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
    await element(by.id('welcome-next')).tap()
    await expect(element(by.text('Swipe through matches'))).toBeVisible()

    await device.takeScreenshot('welcome-screen')
  })

  it('should accept quick navigation through bullet points', async () => {
    await element(by.label('Bullet point')).atIndex(4).tap()
    await expect(element(by.text('Let\'s get started!'))).toBeVisible()
    await expect(element(by.id('welcome-newUser'))).toBeVisible()
  })

  it('should lead to login form', async () => {
    await element(by.id('welcome-newUser')).tap()
    
    await expect(element(by.id('overlay'))).toBeVisible()
    await element(by.id('nda-confirm')).tap()
    await expect(element(by.id('overlay'))).not.toBeVisible()

    await expect(element(by.id('newUser-password'))).toBeVisible()
    await expect(element(by.id('newUser-passwordRepeat'))).toBeVisible()
    await expect(element(by.id('newUser-register'))).toBeVisible()
  })

  it('should fill login form', async () => {
    await element(by.id('newUser-password')).replaceText('strongpassword')
    await element(by.id('newUser-passwordRepeat')).replaceText('strongpassword')
    await element(by.id('newUser-register')).tap()
  })

  it('should show save your password reminder', async () => {
    await expect(element(by.id('overlay'))).toBeVisible()
    await expect(element(by.id('saveYourPassword'))).toBeVisible()
    await element(by.id('saveYourPassword-confirm')).tap()
    await expect(element(by.id('overlay'))).not.toBeVisible()
  })

  it('should redirect to buy screen after login', async () => {
    await waitFor(element(by.id('view-buy'))).toBeVisible()
    await expect(element(by.id('view-buy'))).toBeVisible()
  })
})
