/* eslint-disable max-lines-per-function */
import { act, renderHook, waitFor } from 'test-utils'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { NotificationPopup } from '../components/NotificationPopup'
import { useSettingsSetup } from './useSettingsSetup'

const checkNotificationStatusMock = jest.fn().mockResolvedValue(true)
jest.mock('../../../utils/system/checkNotificationStatus', () => ({
  checkNotificationStatus: () => checkNotificationStatusMock(),
}))

describe('useSettingsSetup', () => {
  beforeEach(() => {
    useSettingsStore.getState().reset()
  })
  it('returns default settings items', async () => {
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current).toEqual([
      {
        items: [{ title: 'testView' }, { title: 'contact' }, { title: 'aboutPeach' }],
      },
      {
        headline: 'profileSettings',
        items: [
          { title: 'myProfile' },
          { title: 'referrals' },
          { title: 'backups', warning: false },
          { title: 'networkFees' },
          { title: 'transactionBatching' },
          { title: 'paymentMethods' },
        ],
      },
      {
        headline: 'appSettings',
        items: [
          { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'analytics' },
          { onPress: expect.any(Function), title: 'notifications' },
          { title: 'nodeSetup' },
          { title: 'payoutAddress' },
          { title: 'currency' },
          { title: 'language' },
        ],
      },
    ])
  })
  it('returns shows analytics as active if it is', async () => {
    useSettingsStore.getState().setEnableAnalytics(true)
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current[2].items).toEqual([
      { enabled: true, iconId: 'toggleRight', onPress: expect.any(Function), title: 'analytics' },
      { onPress: expect.any(Function), title: 'notifications' },
      { title: 'nodeSetup' },
      { title: 'payoutAddress' },
      { title: 'currency' },
      { title: 'language' },
    ])
  })
  it('does not highlight backups if backup reminder is not active', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current[1].items).toEqual([
      { title: 'myProfile' },
      { title: 'referrals' },
      { title: 'backups', warning: false },
      { title: 'networkFees' },
      { title: 'transactionBatching' },
      { title: 'paymentMethods' },
    ])
  })
  it('does highlight backups if backup reminder is  active', async () => {
    useSettingsStore.getState().setShowBackupReminder(true)
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current[1].items).toEqual([
      { title: 'myProfile' },
      { title: 'referrals' },
      { title: 'backups', warning: true, iconId: 'alertTriangle' },
      { title: 'networkFees' },
      { title: 'transactionBatching' },
      { title: 'paymentMethods' },
    ])
  })

  it('opens notification popup', async () => {
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())

    act(() => result.current[2].items[1].onPress?.())
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'turn off notifications?',
      content: <NotificationPopup />,
      visible: true,
      level: 'WARN',
      action2: {
        callback: expect.any(Function),
        label: 'never mind',
        icon: 'arrowLeftCircle',
      },
      action1: {
        callback: expect.any(Function),
        label: 'yes, turn off',
        icon: 'slash',
      },
    })
  })
})
