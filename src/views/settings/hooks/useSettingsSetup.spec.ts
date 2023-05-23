/* eslint-disable max-lines-per-function */
import { renderHook } from '@testing-library/react-native'
import { useSettingsSetup } from './useSettingsSetup'
import { settingsStore } from '../../../store/settingsStore'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))

describe('useSettingsSetup', () => {
  afterEach(() => {
    settingsStore.getState().reset()
  })
  it('returns default settings items', () => {
    const { result } = renderHook(useSettingsSetup)
    expect(result.current).toEqual([
      {
        items: [{ title: 'testView' }, { title: 'contact' }, { title: 'aboutPeach' }],
      },
      {
        headline: 'profileSettings',
        items: [
          { title: 'myProfile' },
          { title: 'referrals' },
          { iconId: 'alertTriangle', title: 'backups', warning: true },
          { title: 'networkFees' },
          { title: 'paymentMethods' },
        ],
      },
      {
        headline: 'appSettings',
        items: [
          { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'analytics' },
          { onPress: expect.any(Function), title: 'notifications' },
          { enabled: true, iconId: 'toggleRight', onPress: expect.any(Function), title: 'peachWallet' },
          { title: 'currency' },
          { title: 'language' },
        ],
      },
    ])
  })
  it('returns payoutAddress if peach wallet is not active', () => {
    settingsStore.getState().setPeachWalletActive(false)
    const { result } = renderHook(useSettingsSetup)
    expect(result.current[2].items).toEqual([
      { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'analytics' },
      { onPress: expect.any(Function), title: 'notifications' },
      { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'peachWallet' },
      { title: 'payoutAddress' },
      { title: 'currency' },
      { title: 'language' },
    ])
  })
  it('returns shows analytics as active if it is', () => {
    settingsStore.getState().setEnableAnalytics(true)
    const { result } = renderHook(useSettingsSetup)
    expect(result.current[2].items).toEqual([
      { enabled: true, iconId: 'toggleRight', onPress: expect.any(Function), title: 'analytics' },
      { onPress: expect.any(Function), title: 'notifications' },
      { enabled: true, iconId: 'toggleRight', onPress: expect.any(Function), title: 'peachWallet' },
      { title: 'currency' },
      { title: 'language' },
    ])
  })
  it('does not highlight backups if backup reminder is not active', () => {
    settingsStore.getState().setShowBackupReminder(false)
    const { result } = renderHook(useSettingsSetup)
    expect(result.current[1].items).toEqual([
      { title: 'myProfile' },
      { title: 'referrals' },
      { title: 'backups', warning: false },
      { title: 'networkFees' },
      { title: 'paymentMethods' },
    ])
  })
})
