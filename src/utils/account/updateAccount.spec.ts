import { settingsStore } from './../../store/settingsStore'
import { account1 } from '../../../tests/unit/data/accountData'
import { tradingLimit } from '../../../tests/unit/data/tradingLimitsData'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getWallet } from '../wallet'
import { account, defaultAccount } from './account'
import { updateAccount } from './updateAccount'

const getDeviceLocaleMock = jest.fn((): string | undefined => 'en')
jest.mock('../system', () => ({
  getDeviceLocale: () => getDeviceLocaleMock(),
}))

const setLocaleQuietMock = jest.fn()
jest.mock('../i18n', () => ({
  setLocaleQuiet: (locale: string) => setLocaleQuietMock(locale),
}))

describe('updateAccount', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('sets an account, sets wallet and peachAccount', () => {
    updateAccount(account1)
    expect(account).toEqual(account1)
    expect(getWallet()).toBeDefined()
    expect(getPeachAccount()).toBeDefined()
  })
  it('overwrites an account', () => {
    updateAccount({ ...account1, tradingLimit }, true)
    expect(account.tradingLimit).toEqual(tradingLimit)
  })
  it('merges an account with update', () => {
    updateAccount({ ...account1, tradingLimit })
    expect(account.tradingLimit).toEqual(defaultAccount.tradingLimit)
  })
  it('does not set the locale to undefined', () => {
    getDeviceLocaleMock.mockReturnValueOnce(undefined)
    settingsStore.setState({ locale: undefined })
    updateAccount(account1)
    expect(setLocaleQuietMock).toHaveBeenCalledWith('en')
  })
})
