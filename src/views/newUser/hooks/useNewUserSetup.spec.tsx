import analytics from '@react-native-firebase/analytics'
import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { recoveredAccount } from '../../../../tests/unit/data/accountData'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import {
  defaultNotificationState,
  notificationStorage,
  notificationStore,
} from '../../../components/footer/notificationsStore'
import { configStore } from '../../../store/configStore'
import { defaultConfig, defaultSettings } from '../../../store/defaults'
import { settingsStorage, settingsStore } from '../../../store/settingsStore'
import { defaultAccount, getAccount, setAccount } from '../../../utils/account'
import { accountStorage } from '../../../utils/account/accountStorage'
import { chatStorage } from '../../../utils/account/chatStorage'
import { contractStorage } from '../../../utils/account/contractStorage'
import { offerStorage } from '../../../utils/account/offerStorage'
import { getAccessToken } from '../../../utils/peachAPI/accessToken'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { sessionStorage } from '../../../utils/session'
import { defaultWalletState, walletStorage, walletStore } from '../../../utils/wallet/walletStore'
import { useNewUserSetup } from './useNewUserSetup'

const useRouteMock = jest.fn(() => ({
  params: {
    referralCode: '1234567890',
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const entropyToMnemonicMock = jest.fn(() => recoveredAccount.mnemonic)
jest.mock('bip39', () => ({
  ...jest.requireActual('bip39'),
  entropyToMnemonic: () => entropyToMnemonicMock(),
}))

const registerMock = jest.fn().mockResolvedValue([
  {
    expiry: new Date().getTime() + 1000 * 60 * 60,
    accessToken: 'token',
    restored: false,
  },
])
const userUpdateMock = jest.fn()
jest.mock('../../../init/userUpdate', () => ({
  userUpdate: (...args: []) => userUpdateMock(...args),
}))

jest.mock('../../../utils/peachAPI', () => ({
  register: (...args: any[]) => registerMock(...args),
}))
jest.useFakeTimers({ now: new Date(2023, 0, 0) })

describe('useNewUserSetup', () => {
  const forProcessToFinish = async () => {
    await act(() => {
      jest.runAllTimers()
    })
    await act(() => {
      jest.runAllTimers()
    })
  }
  beforeEach(() => {
    jest.clearAllMocks()
    settingsStore.setState({ pgpPublished: false, fcmToken: undefined })
    setAccount(defaultAccount)
  })
  it('should return default values', async () => {
    const { result } = renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    expect(result.current).toStrictEqual({ success: false, error: '', isLoading: true, userExistsForDevice: false })
  })
  it('should create an account', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()
    expect(getAccount()).toStrictEqual(recoveredAccount)
    expect(registerMock).toHaveBeenCalledWith({
      message: 'Peach Registration 1672441200000',
      publicKey: '03a9ea8d8000731f80287b43af99f28294b81ee011a5bde5dfd2beb6c03f6e3682',
      signature:
        // eslint-disable-next-line max-len
        '2ac2bfffe10d3f046a53b9ecab21996350d42fd192713f343df7d8e038ae192f451aeedd0aad56f2772632ac277cf0b46b2a4f0fb6be36a3b052946020c51c10',
    })
  })
  it('should update the user', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()
    expect(userUpdateMock).toHaveBeenCalled()
  })
  it('should store the new identity', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    const expectedIdentity = {
      publicKey: recoveredAccount.publicKey,
      privKey: recoveredAccount.privKey,
      mnemonic: recoveredAccount.mnemonic,
      pgp: recoveredAccount.pgp,
    }

    expect(accountStorage.getMap('identity')).toStrictEqual(expectedIdentity)
  })
  it('should store the trading limit', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    expect(accountStorage.getMap('tradingLimit')).toStrictEqual(recoveredAccount.tradingLimit)
  })
  it('should store the payment data', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    expect(accountStorage.getMap('paymentData')).toStrictEqual(recoveredAccount.paymentData)
  })
  it('should store the offers', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    recoveredAccount.offers.forEach((offer, index) => {
      expect(accountStorage.getMap(offer.id)).toStrictEqual(recoveredAccount.offers[index])
    })
  })
  it('should store the contracts', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    recoveredAccount.contracts.forEach((contract, index) => {
      expect(accountStorage.getMap(contract.id)).toStrictEqual(recoveredAccount.contracts[index])
    })
  })
  it('should store the chats', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    Object.values(recoveredAccount.chats).forEach((chat, index) => {
      expect(accountStorage.getMap(chat.id)).toStrictEqual(recoveredAccount.chats[index])
    })
  })
  it('should set success to true', async () => {
    const { result } = renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()
    expect(result.current).toStrictEqual({ success: true, error: '', userExistsForDevice: false })
  })
  it('should navigate to the home screen after 1500ms', async () => {
    renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()
    expect(replaceMock).toHaveBeenCalledWith('home')
  })
  it('should handle authentication errors', async () => {
    // @ts-ignore
    registerMock.mockReturnValue([null, { error: 'testError' }])
    const { result } = renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    expect(result.current).toStrictEqual({
      success: false,
      error: 'testError',
      userExistsForDevice: false,
    })
    expect(getAccount()).toStrictEqual(defaultAccount)

    const storages = [
      accountStorage,
      walletStorage,
      offerStorage,
      contractStorage,
      chatStorage,
      sessionStorage,
      settingsStorage,
      notificationStorage,
    ]

    storages.forEach((storage) => {
      expect(storage.clearStore).toHaveBeenCalled()
    })

    expect(notificationStore.getState()).toEqual(expect.objectContaining(defaultNotificationState))
    expect(configStore.getState()).toEqual(expect.objectContaining(defaultConfig))
    expect(walletStore.getState()).toEqual(expect.objectContaining(defaultWalletState))
    expect(settingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))

    expect(getAccessToken()).toBeNull()
    expect(getPeachAccount()).toBeNull()
    expect(analytics().logEvent).toHaveBeenCalledWith('account_deleted')
  })
  it('should catch account creation errors', async () => {
    entropyToMnemonicMock.mockImplementationOnce(() => {
      throw new Error('testError')
    })
    const { result } = renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    expect(result.current).toStrictEqual({
      success: false,
      error: 'testError',
      userExistsForDevice: false,
    })
    expect(getAccount()).toStrictEqual(defaultAccount)

    const storages = [
      accountStorage,
      walletStorage,
      offerStorage,
      contractStorage,
      chatStorage,
      sessionStorage,
      settingsStorage,
      notificationStorage,
    ]

    storages.forEach((storage) => {
      expect(storage.clearStore).toHaveBeenCalled()
    })

    expect(notificationStore.getState()).toEqual(expect.objectContaining(defaultNotificationState))
    expect(configStore.getState()).toEqual(expect.objectContaining(defaultConfig))
    expect(walletStore.getState()).toEqual(expect.objectContaining(defaultWalletState))
    expect(settingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))

    expect(getAccessToken()).toBeNull()
    expect(getPeachAccount()).toBeNull()
    expect(analytics().logEvent).toHaveBeenCalledWith('account_deleted')
  })
  it('should use "UNKNOWN_ERROR" as the fallback error value', async () => {
    registerMock.mockReturnValue([null, null])

    const { result } = renderHook(useNewUserSetup, { wrapper: NavigationWrapper })
    await forProcessToFinish()

    expect(result.current).toStrictEqual({
      success: false,
      error: 'UNKNOWN_ERROR',
      userExistsForDevice: false,
    })
  })
})
