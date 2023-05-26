import { account, removePaymentData, setAccount } from '.'
import { account1, paymentData } from '../../../tests/unit/data/accountData'
import { apiSuccess } from '../../../tests/unit/data/peachAPIData'
import { settingsStore } from '../../store/settingsStore'

const storePaymentDataMock = jest.fn()
jest.mock('./storeAccount/storePaymentData', () => ({
  storePaymentData: () => storePaymentDataMock(),
}))

const deletePaymentHashMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../peachAPI', () => ({
  deletePaymentHash: () => deletePaymentHashMock(),
}))

describe('removePaymentData', () => {
  const makeFakeAccount = () => ({
    ...account1,
    paymentData,
  })
  beforeAll(() => {
    settingsStore.getState().setPreferredPaymentMethods({})
  })

  it('does nothing if payment data does not exist', async () => {
    const fakeAccount = makeFakeAccount()
    await setAccount(fakeAccount)
    await removePaymentData('nonExisting')
    expect(storePaymentDataMock).not.toHaveBeenCalled()
  })
  it('removes payment data from account', async () => {
    const fakeAccount = makeFakeAccount()

    await setAccount(fakeAccount)
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(account.paymentData).toEqual([paymentData[1]])
  })
  it('replaces payment method from preferred payment methods if set and fallback exists', async () => {
    const fakeAccount = makeFakeAccount()
    const [id1, id2] = fakeAccount.paymentData.map(({ id }) => id)

    await setAccount(fakeAccount)
    settingsStore.getState().setPreferredPaymentMethods({
      sepa: id1,
    })
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: id2,
    })
  })
  it('removes payment method from preferred payment methods if set and no fallback exists', async () => {
    const fakeAccount = makeFakeAccount()
    const [id1, id2] = fakeAccount.paymentData.map(({ id }) => id)
    await setAccount(fakeAccount)
    settingsStore.getState().setPreferredPaymentMethods({
      sepa: fakeAccount.paymentData[0].id,
    })
    await removePaymentData(id1)
    await removePaymentData(id2)
    expect(settingsStore.getState().preferredPaymentMethods).toEqual({
      sepa: '',
    })
  })

  it('does not remove payment data if there is an unexpected error from server request', async () => {
    const fakeAccount = makeFakeAccount()
    await setAccount(fakeAccount)

    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'UNEXPECTED' }])
    try {
      await removePaymentData(fakeAccount.paymentData[0].id)
    } catch (e) {
      // @ts-ignore
      expect(e.message).toBe('NETWORK_ERROR')
    }
    expect(account.paymentData).toEqual(paymentData)

    deletePaymentHashMock.mockResolvedValueOnce([null, null])
    try {
      await removePaymentData(fakeAccount.paymentData[0].id)
    } catch (e) {
      // @ts-ignore
      expect(e.message).toBe('NETWORK_ERROR')
    }
    expect(account.paymentData).toEqual(paymentData)
  })

  it('removes payment data from account if server error is expected', async () => {
    const fakeAccount = makeFakeAccount()
    await setAccount(fakeAccount)

    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'UNAUTHORIZED' }])
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(account.paymentData).toEqual([paymentData[1]])

    deletePaymentHashMock.mockResolvedValueOnce([null, { error: 'AUTHENTICATION_FAILED' }])
    await removePaymentData(fakeAccount.paymentData[0].id)
    expect(account.paymentData).toEqual([])
  })
})
