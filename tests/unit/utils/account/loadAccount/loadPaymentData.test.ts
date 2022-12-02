import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount, storeAccount } from '../../../../../src/utils/account'
import { loadPaymentData } from '../../../../../src/utils/account/loadAccount'
import * as file from '../../../../../src/utils/file'
import * as accountData from '../../../data/accountData'
import { resetFakeFiles } from '../../../prepare'

const password = 'supersecret'

jest.mock('../../../../../src/utils/file', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../src/utils/file'),
}))

describe('loadPaymentData', () => {
  let readFileSpy: jest.SpyInstance

  beforeEach(async () => {
    readFileSpy = jest.spyOn(file, 'readFile')
    await setAccount(defaultAccount, true)
  })
  afterEach(() => {
    resetFakeFiles()
    readFileSpy.mockClear()
  })

  it('loads payment data from files', async () => {
    await storeAccount(accountData.account1, password)

    const paymentData = await loadPaymentData(password)
    expect(readFileSpy).toHaveBeenCalledWith('/peach-account-paymentData.json', password)
    deepStrictEqual(paymentData, accountData.account1.paymentData)
  })
})
