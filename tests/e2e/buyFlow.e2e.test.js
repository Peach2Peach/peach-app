import jestExpect from 'expect'
import createUser from './commonActions/createUser'

describe.skip('Buy flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
        camera: 'YES',
      },
    })
    await createUser()
  })

  it('should show buy screen', async () => {
    await expect(element(by.id('view-buy'))).toBeVisible()
  })

  it('can select amount', async () => {
    await element(by.id('buy-amount-open')).tap()
    await expect(element(by.id('buy-amount-close'))).toBeVisible()
    await expect(element(by.id('buy-amount-item-50000'))).toBeVisible()
    await expect(element(by.id('buy-amount-item-250000'))).toBeVisible()
    await expect(element(by.id('buy-amount-item-500000'))).toBeVisible()

    // select 250k sats
    await element(by.id('buy-amount-item-250000')).tap()
    const attributes = await element(by.id('buy-amount-open')).getAttributes()
    jestExpect(attributes.label).toEqual('0.00  250 000 sats')
    await element(by.id('navigation-next')).tap()
  })

  it('has no MoP by default and next is disabled', async () => {
    const nextButtonattributes = await element(by.id('navigation-next')).getAttributes()
    await expect(element(by.id('child').withAncestor(by.id('checkboxes-buy-mops')))).not.toBeVisible()
    jestExpect(nextButtonattributes.label).toEqual('next (disabled)')
  })

  // TODO write test when new payment preferences flow is integrated
  it.skip('can add MoP', async () => {
    await element(by.id('buy-add-mop')).tap()
  })
})
