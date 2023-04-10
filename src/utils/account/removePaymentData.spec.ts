import { account, removePaymentData, setAccount } from '.'
import { account1, paymentData } from '../../../tests/unit/data/accountData'
import { settingsStore } from '../../store/settingsStore'

const storePaymentDataMock = jest.fn()
jest.mock('./storeAccount/storePaymentData', () => ({
  storePaymentData: () => storePaymentDataMock(),
}))
describe('removePaymentData', () => {
  const fakeAccount = {
    ...account1,
    paymentData,
  }
  beforeAll(() => {
    settingsStore.getState().setPreferredPaymentMethods({})
  })

  it('does nothing if payment data does not exist', async () => {
    await setAccount(fakeAccount)
    await removePaymentData('nonExisting')
    expect(storePaymentDataMock).not.toHaveBeenCalled()
  })
  it('removes payment data from account', async () => {
    await setAccount(fakeAccount)
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(account.paymentData).toEqual([fakeAccount.paymentData[1]])
  })
  it('replaces payment method from preferred payment methods if set and fallback exists', async () => {
    await setAccount(fakeAccount)
    settingsStore.getState().setPreferredPaymentMethods({
      sepa: fakeAccount.paymentData[0].id,
    })
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: fakeAccount.paymentData[1].id,
    })
  })
  it('removes payment method from preferred payment methods if set and no fallback exists', async () => {
    await setAccount(fakeAccount)
    settingsStore.getState().setPreferredPaymentMethods({
      sepa: fakeAccount.paymentData[0].id,
    })
    await removePaymentData(fakeAccount.paymentData[0].id)
    await removePaymentData(fakeAccount.paymentData[1].id)
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: '',
    })
  })
})
