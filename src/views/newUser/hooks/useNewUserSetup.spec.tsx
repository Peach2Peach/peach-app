import analytics from '@react-native-firebase/analytics'
import { act } from 'react-test-renderer'
import { renderHook, waitFor } from 'test-utils'
import { recoveredAccount } from '../../../../tests/unit/data/accountData'
import { headerState, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import {
  defaultNotificationState,
  notificationStorage,
  useNotificationStore,
} from '../../../components/footer/notificationsStore'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { useConfigStore } from '../../../store/configStore'
import { defaultConfig } from '../../../store/defaults'
import { defaultSettings, settingsStorage, useSettingsStore } from '../../../store/settingsStore'
import { defaultAccount, getAccount, setAccount } from '../../../utils/account'
import { accountStorage } from '../../../utils/account/accountStorage'
import { chatStorage } from '../../../utils/account/chatStorage'
import { contractStorage } from '../../../utils/account/contractStorage'
import { offerStorage } from '../../../utils/account/offerStorage'
import { getAccessToken } from '../../../utils/peachAPI/accessToken'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { defaultWalletState, useWalletState, walletStorage } from '../../../utils/wallet/walletStore'
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
  register: (...args: unknown[]) => registerMock(...args),
}))

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
    jest.useFakeTimers({ now: new Date('2022-12-30T23:00:00.000Z') })

    useSettingsStore.setState({ pgpPublished: false, fcmToken: undefined })
    setAccount(defaultAccount)
  })
  it('should return default values', () => {
    const { result } = renderHook(useNewUserSetup)
    expect(result.current).toStrictEqual({ success: false, error: '', userExistsForDevice: false })
  })
  it('should set up the header correctly', () => {
    renderHook(useNewUserSetup)
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show header actions when not loading', async () => {
    renderHook(useNewUserSetup)

    await waitFor(() => expect(headerState.header().props.icons).toHaveLength(2))
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should create an account', async () => {
    renderHook(useNewUserSetup)
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
    renderHook(useNewUserSetup)
    await forProcessToFinish()
    expect(userUpdateMock).toHaveBeenCalled()
  })
  it('should store the new identity', async () => {
    renderHook(useNewUserSetup)
    await forProcessToFinish()

    const expectedIdentity = {
      publicKey: recoveredAccount.publicKey,
      privKey: recoveredAccount.privKey,
      mnemonic: recoveredAccount.mnemonic,
      pgp: recoveredAccount.pgp,
      base58: recoveredAccount.base58,
    }

    expect(accountStorage.getMap('identity')).toStrictEqual(expectedIdentity)
  })

  it('should set success to true', async () => {
    const { result } = renderHook(useNewUserSetup)
    await forProcessToFinish()
    expect(result.current).toStrictEqual({ success: true, error: '', userExistsForDevice: false })
  })
  it('should navigate to the home screen after 1500ms', async () => {
    renderHook(useNewUserSetup)
    await forProcessToFinish()
    expect(replaceMock).toHaveBeenCalledWith('home')
  })
  it('should handle authentication errors', async () => {
    // @ts-ignore
    registerMock.mockReturnValue([null, { error: 'testError' }])
    const { result } = renderHook(useNewUserSetup)
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
      settingsStorage,
      notificationStorage,
    ]

    storages.forEach((storage) => {
      expect(storage.clearStore).toHaveBeenCalled()
    })

    expect(useNotificationStore.getState()).toEqual(expect.objectContaining(defaultNotificationState))
    expect(useConfigStore.getState()).toEqual(expect.objectContaining(defaultConfig))
    expect(useWalletState.getState()).toEqual(expect.objectContaining(defaultWalletState))
    expect(useSettingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))

    expect(getAccessToken()).toBeNull()
    expect(getPeachAccount()).toBeNull()
    expect(analytics().logEvent).toHaveBeenCalledWith('account_deleted')
  })
  it('should catch account creation errors', async () => {
    entropyToMnemonicMock.mockImplementationOnce(() => {
      throw new Error('testError')
    })
    const { result } = renderHook(useNewUserSetup)
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
      settingsStorage,
      notificationStorage,
    ]

    storages.forEach((storage) => {
      expect(storage.clearStore).toHaveBeenCalled()
    })

    expect(useNotificationStore.getState()).toEqual(expect.objectContaining(defaultNotificationState))
    expect(useConfigStore.getState()).toEqual(expect.objectContaining(defaultConfig))
    expect(useWalletState.getState()).toEqual(expect.objectContaining(defaultWalletState))
    expect(useSettingsStore.getState()).toEqual(expect.objectContaining(defaultSettings))

    expect(getAccessToken()).toBeNull()
    expect(getPeachAccount()).toBeNull()
    expect(analytics().logEvent).toHaveBeenCalledWith('account_deleted')
  })
  it('should use "UNKNOWN_ERROR" as the fallback error value', async () => {
    registerMock.mockReturnValue([null, null])

    const { result } = renderHook(useNewUserSetup)
    await forProcessToFinish()

    expect(result.current).toStrictEqual({
      success: false,
      error: 'UNKNOWN_ERROR',
      userExistsForDevice: false,
    })
  })
  it('should handle existing user by setting temporary account', async () => {
    registerMock.mockReturnValue([
      {
        expiry: new Date().getTime() + 1000 * 60 * 60,
        accessToken: 'token',
        restored: true,
      },
      null,
    ])
    const { result } = renderHook(useNewUserSetup)
    await forProcessToFinish()

    expect(result.current).toStrictEqual({
      success: false,
      error: '',
      userExistsForDevice: true,
    })

    const { result: temporaryAccount } = renderHook(() => useTemporaryAccount())
    expect(temporaryAccount.current.temporaryAccount).toBeDefined()
  })
})
