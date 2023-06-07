import { account1 } from '../../../tests/unit/data/accountData'
import { tradingLimit } from '../../../tests/unit/data/tradingLimitsData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { dataMigrationAfterLoadingWallet } from '../../init/dataMigration/dataMigrationAfterLoadingWallet'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { settingsStore } from './../../store/settingsStore'
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

jest.mock('../../init/dataMigration/dataMigrationAfterLoadingWallet', () => ({
  dataMigrationAfterLoadingWallet: jest.fn(),
}))

const loadAccountFromSeedPhraseMock = jest.fn()
jest.mock('./loadAccountFromSeedPhrase', () => ({
  loadAccountFromSeedPhrase: () => loadAccountFromSeedPhraseMock(),
}))

describe('updateAccount', () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, 'loadWallet')

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('sets an account, sets wallet and peachAccount', async () => {
    await updateAccount(account1)
    expect(account).toEqual(account1)
    expect(getWallet()).toBeDefined()
    expect(getPeachAccount()).toBeDefined()
  })
  it('overwrites an account', async () => {
    await updateAccount({ ...account1, tradingLimit }, true)
    expect(account.tradingLimit).toEqual(tradingLimit)
  })
  it('merges an account with update', async () => {
    await updateAccount({ ...account1, tradingLimit })
    expect(account.tradingLimit).toEqual(defaultAccount.tradingLimit)
  })
  it('does not set the locale to undefined', async () => {
    getDeviceLocaleMock.mockReturnValueOnce(undefined)
    settingsStore.setState({ locale: undefined })
    await updateAccount(account1)
    expect(setLocaleQuietMock).toHaveBeenCalledWith('en')
  })
  it('loads wallet from seed and starts migration', async () => {
    const legacyAccount = { ...account1, base58: undefined }
    const wallet = createTestWallet(
      'tprv8ZgxMBicQKsPeMiDjtXBGAyFY1wEMGgomjwf54ZmiZfKTNYvVdBa6GqWUwnvtHm6NKVkQkhCKxaobd9JPxNEXgDfVgJ5RNHJ3ivogSG3V1R',
    )
    loadAccountFromSeedPhraseMock.mockReturnValueOnce(wallet)
    await updateAccount(legacyAccount)
    expect(dataMigrationAfterLoadingWallet).toHaveBeenCalledWith(wallet, legacyAccount)
  })
  it('loads peach account', async () => {
    await updateAccount(account1)

    expect(getPeachAccount()?.privateKey?.toString('hex')).toBe(
      '62233e988e4ca00c3b346b4753c7dc316f6ce39280410072ddab298f36a7fe64',
    )
  })
  it('loads peach wallets', async () => {
    await updateAccount(account1)

    const privateKey = '80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5'

    expect(getWallet().privateKey?.toString('hex')).toBe(privateKey)
    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic)
  })
})
