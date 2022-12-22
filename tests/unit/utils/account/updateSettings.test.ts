import { deepStrictEqual } from 'assert'
import { APPVERSION } from '../../../../src/constants'
import { account, defaultAccount, setAccount, updateSettings } from '../../../../src/utils/account'
import { resetStorage } from '../../prepare'

describe('updateSettings', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('updates account settings', () => {
    const meansOfPayment: MeansOfPayment = {
      EUR: ['sepa'],
      CHF: ['sepa', 'twint'],
    }
    const newSettings = {
      meansOfPayment,
    }

    updateSettings(newSettings)
    deepStrictEqual(account.settings, {
      ...account.settings,
      ...newSettings,
    })
  })

  it('updates account settings without overwriting untouched settings', () => {
    const meansOfPayment: MeansOfPayment = {
      EUR: ['sepa', 'paypal'],
    }

    updateSettings({ meansOfPayment })
    deepStrictEqual(account.settings, {
      appVersion: APPVERSION,
      displayCurrency: 'EUR',
      locale: 'en',
      meansOfPayment: {
        EUR: ['sepa', 'paypal'],
      },
      preferredCurrencies: [],
      preferredPaymentMethods: {},
      showBackupReminder: true,
      showDisputeDisclaimer: true,
      customFeeRate: 1,
      selectedFeeRate: 'halfHourFee',
    })
  })
})
