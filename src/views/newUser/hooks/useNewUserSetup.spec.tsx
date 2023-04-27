import { useNewUserSetup } from './useNewUserSetup'
import { act, renderHook } from '@testing-library/react-native'
import { NavigationContext } from '@react-navigation/native'
import { defaultAccount, getAccount, setAccount } from '../../../utils/account'
import { recoveredAccount } from '../../../../tests/unit/data/accountData'
import { settingsStorage, settingsStore } from '../../../store/settingsStore'
import { accountStorage } from '../../../utils/account/accountStorage'
import { auth, updateUser } from '../../../utils/peachAPI'
import {
  defaultNotificationState,
  notificationStorage,
  notificationStore,
} from '../../../components/footer/notificationsStore'
import { chatStorage } from '../../../utils/account/chatStorage'
import { contractStorage } from '../../../utils/account/contractStorage'
import { offerStorage } from '../../../utils/account/offerStorage'
import { defaultWalletState, walletStorage, walletStore } from '../../../utils/wallet/walletStore'
import { sessionStorage } from '../../../utils/session'
import { configStore } from '../../../store/configStore'
import analytics from '@react-native-firebase/analytics'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { getAccessToken } from '../../../utils/peachAPI/accessToken'
import { defaultConfig, defaultSettings } from '../../../store/defaults'

const useRouteMock = jest.fn(() => ({
  params: {
    referralCode: '1234567890',
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const replaceMock = jest.fn()
const useNavigationMock = jest.fn(() => ({
  replace: replaceMock,
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const entropyToMnemonicMock = jest.fn(() => recoveredAccount.mnemonic)
jest.mock('bip39', () => ({
  ...jest.requireActual('bip39'),
  entropyToMnemonic: () => entropyToMnemonicMock(),
}))

jest.mock('../../../utils/peachAPI')

const navigationWrapper = ({ children }: any) => (
  // @ts-ignore
  <NavigationContext.Provider value={{ isFocused: () => true, addListener: jest.fn(() => jest.fn()) }}>
    {children}
  </NavigationContext.Provider>
)

jest.useFakeTimers()
describe('useNewUserSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    settingsStore.setState({ pgpPublished: false, fcmToken: undefined })
    setAccount(defaultAccount)
  })
  it('should return success and error', async () => {
    const { result } = renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    expect(result.current).toStrictEqual({ success: false, error: '' })
  })
  it('should create an account', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })
    expect(getAccount()).toStrictEqual(recoveredAccount)
  })
  it('should update the user', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })
    expect(updateUser).toHaveBeenCalled()
  })
  it('should set the pgp published state', async () => {
    expect(settingsStore.getState().pgpPublished).toBe(false)

    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(settingsStore.getState().pgpPublished).toBe(true)
  })
  it('should set the FCM token', async () => {
    expect(settingsStore.getState().fcmToken).toBe(undefined)

    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(settingsStore.getState().fcmToken).toBe('testMessagingToken')
  })
  it('should store the new identity', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    const expectedIdentity = {
      publicKey: recoveredAccount.publicKey,
      privKey: recoveredAccount.privKey,
      mnemonic: recoveredAccount.mnemonic,
      pgp: recoveredAccount.pgp,
    }

    expect(accountStorage.getMap('identity')).toStrictEqual(expectedIdentity)
  })
  it('should store the trading limit', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(accountStorage.getMap('tradingLimit')).toStrictEqual(recoveredAccount.tradingLimit)
  })
  it('should store the payment data', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(accountStorage.getMap('paymentData')).toStrictEqual(recoveredAccount.paymentData)
  })
  it('should store the offers', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    recoveredAccount.offers.forEach((offer, index) => {
      expect(accountStorage.getMap(offer.id)).toStrictEqual(recoveredAccount.offers[index])
    })
  })
  it('should store the contracts', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    recoveredAccount.contracts.forEach((contract, index) => {
      expect(accountStorage.getMap(contract.id)).toStrictEqual(recoveredAccount.contracts[index])
    })
  })
  it('should store the chats', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    Object.values(recoveredAccount.chats).forEach((chat, index) => {
      expect(accountStorage.getMap(chat.id)).toStrictEqual(recoveredAccount.chats[index])
    })
  })
  it('should set success to true', async () => {
    const { result } = renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })
    expect(result.current).toStrictEqual({ success: true, error: '' })
  })
  it('should navigate to the home screen after 1500ms', async () => {
    renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })
    expect(replaceMock).toHaveBeenCalledWith('home')
  })
  it('should handle authentication errors', async () => {
    // @ts-ignore
    auth.mockReturnValue([null, { error: 'testError' }])
    const { result } = renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toStrictEqual({ success: false, error: 'testError' })
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
    const { result } = renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toStrictEqual({ success: false, error: 'testError' })
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
    // @ts-ignore
    auth.mockReturnValue([null, null])

    const { result } = renderHook(useNewUserSetup, { wrapper: navigationWrapper })
    await act(() => {
      jest.runAllTimers()
    })

    expect(result.current).toStrictEqual({ success: false, error: 'UNKNOWN_ERROR' })
  })
})
