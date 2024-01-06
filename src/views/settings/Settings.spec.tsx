import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, fireEvent, render, waitFor } from 'test-utils'
import { setRouteMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { Popup } from '../../components/popup/Popup'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import { Settings } from './Settings'

expect.extend({
  toMatchDiffSnapshot,
})

const checkNotificationStatusMock = jest.fn().mockResolvedValue(true)
jest.mock('../../utils/system/checkNotificationStatus', () => ({
  checkNotificationStatus: () => checkNotificationStatusMock(),
}))

jest.useFakeTimers()

describe('Settings', () => {
  beforeAll(() => {
    setRouteMock({ name: 'settings', key: 'settings' })
  })
  beforeEach(() => {
    useSettingsStore.getState().reset()
  })
  it('should render correctly', async () => {
    const { toJSON } = render(<Settings />)
    await act(async () => {
      await jest.runAllTimers()
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should highlight backups if backup reminder is shown', async () => {
    useSettingsStore.getState().setShowBackupReminder(true)
    const { toJSON } = render(<Settings />)
    await act(async () => {
      await jest.runAllTimers()
    })
    const withReminder = toJSON()
    act(() => {
      useSettingsStore.getState().setShowBackupReminder(false)
    })
    const withoutReminder = toJSON()
    expect(withReminder).toMatchDiffSnapshot(withoutReminder)
  })
  it('should open the notification popup', async () => {
    const { getByText } = render(
      <>
        <Settings />
        <Popup />
      </>,
    )
    await act(async () => {
      await jest.runAllTimers()
    })
    fireEvent.press(getByText('notifications'))
    await waitFor(() => expect(getByText('turn off notifications?')).toBeTruthy())
  })
})
