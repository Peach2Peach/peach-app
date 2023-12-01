import { account1 } from '../../../tests/unit/data/accountData'
import { tradingLimit } from '../../../tests/unit/data/tradingLimitsData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { dataMigrationAfterLoadingWallet } from '../../init/dataMigration/dataMigrationAfterLoadingWallet'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../i18n'
import { peachAPI } from '../peachAPI'
import { getWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { defaultAccount, useAccountStore } from './account'
import { updateAccount } from './updateAccount'

const getDeviceLocaleMock = jest.fn((): string | undefined => 'en')
jest.mock('../system', () => ({
  getDeviceLocale: () => getDeviceLocaleMock(),
}))

const setLocaleQuietMock = jest.spyOn(i18n, 'setLocale')

jest.mock('../../init/dataMigration/dataMigrationAfterLoadingWallet', () => ({
  dataMigrationAfterLoadingWallet: jest.fn(),
}))

const loadAccountFromSeedPhraseMock = jest.fn()
jest.mock('./loadAccountFromSeedPhrase', () => ({
  loadAccountFromSeedPhrase: () => loadAccountFromSeedPhraseMock(),
}))

describe('updateAccount', () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, 'loadWallet')
  it('sets an account, sets wallet and peachAccount', () => {
    updateAccount(account1)
    const account = useAccountStore.getState().account
    expect(account).toEqual(account1)
    expect(getWallet()).toBeDefined()
    expect(peachAPI.options.peachAccount).toBeDefined()
  })
  it('overwrites an account', () => {
    updateAccount({ ...account1, tradingLimit }, true)
    const account = useAccountStore.getState().account
    expect(account.tradingLimit).toEqual(tradingLimit)
  })
  it('merges an account with update', () => {
    updateAccount({ ...account1, tradingLimit })
    const account = useAccountStore.getState().account
    expect(account.tradingLimit).toEqual(defaultAccount.tradingLimit)
  })
  it('does not set the locale to undefined', () => {
    getDeviceLocaleMock.mockReturnValueOnce(undefined)
    useSettingsStore.setState({ locale: undefined })
    updateAccount(account1)
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

    expect(peachAPI.options.peachAccount?.privateKey?.toString('hex')).toBe(
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
