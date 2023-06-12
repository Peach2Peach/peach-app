import { account, addPaymentData, defaultAccount, setAccount } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { settingsStore } from '../../store/settingsStore'

describe('addPaymentData', () => {
  beforeAll(() => {
    setAccount(defaultAccount)
  })

  it('adds new payment data to account', () => {
    addPaymentData(accountData.paymentData[0])
    addPaymentData(accountData.paymentData[1])
    expect(account.paymentData).toEqual(accountData.paymentData)
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: 'sepa-1069850495',
    })
  })
  it('updates payment data on account', () => {
    addPaymentData({
      ...accountData.paymentData[1],
      beneficiary: 'Hal',
    })
    expect(account.paymentData[1].beneficiary).toBe('Hal')
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: 'sepa-1069850495',
    })
  })
})
