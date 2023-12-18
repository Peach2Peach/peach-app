/* eslint-disable max-lines-per-function */
import { act, renderHook, waitFor } from 'test-utils'
import { PopupAction } from '../../../components/popup'
import { WarningPopup } from '../../../popups/WarningPopup'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
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
        items: ['testView', 'contact', 'aboutPeach'],
      },
      {
        headline: 'profileSettings',
        items: [
          'myProfile',
          'referrals',
          { title: 'backups', warning: false },
          'networkFees',
          'transactionBatching',
          'paymentMethods',
        ],
      },
      {
        headline: 'appSettings',
        items: [
          { enabled: false, iconId: 'toggleLeft', onPress: expect.any(Function), title: 'analytics' },
          { onPress: expect.any(Function), title: 'notifications' },
          'nodeSetup',
          'payoutAddress',
          'currency',
          'language',
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
      'nodeSetup',
      'payoutAddress',
      'currency',
      'language',
    ])
  })
  it('does not highlight backups if backup reminder is not active', async () => {
    useSettingsStore.getState().setShowBackupReminder(false)
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current[1].items).toEqual([
      'myProfile',
      'referrals',
      { title: 'backups', warning: false },
      'networkFees',
      'transactionBatching',
      'paymentMethods',
    ])
  })
  it('does highlight backups if backup reminder is  active', async () => {
    useSettingsStore.getState().setShowBackupReminder(true)
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    expect(result.current[1].items).toEqual([
      'myProfile',
      'referrals',
      { title: 'backups', warning: true, iconId: 'alertTriangle' },
      'networkFees',
      'transactionBatching',
      'paymentMethods',
    ])
  })

  it('opens notification popup', async () => {
    const { result } = renderHook(useSettingsSetup)
    await waitFor(() => expect(checkNotificationStatusMock).toHaveBeenCalled())
    const notificationItem = result.current[2].items[1]
    const notificationClick
      = typeof notificationItem !== 'string' && 'onPress' in notificationItem ? notificationItem.onPress : () => null

    act(notificationClick)
    expect(usePopupStore.getState().visible).toBe(true)
    expect(usePopupStore.getState().popupComponent).toEqual(
      <WarningPopup
        title="turn off notifications?"
        content={<NotificationPopup />}
        actions={
          <>
            <PopupAction
              label="no, keep them on"
              iconId="arrowLeftCircle"
              onPress={expect.any(Function)}
              textStyle={tw`text-black-1`}
            />
            <PopupAction
              label="yes, turn off"
              iconId="slash"
              onPress={expect.any(Function)}
              textStyle={tw`text-black-1`}
              reverseOrder
            />
          </>
        }
      />,
    )
  })
})
